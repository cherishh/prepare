let PENDING = "pending";
let FULFILLED = "fulfilled";
let REJECTED = "rejected";

function Promise(fn) {
  this.status = PENDING;
  this.value = null;
  this.reason = null;

  this.onFulfilledCbs = [];
  this.onRejectedCbs = [];

  let that = this;

  function resolve(value) {
    if (that.status === PENDING) {
      that.status = FULFILLED;
      that.value = value;
      that.onFulfilledCbs.forEach((fn) => fn(that.value));
    }
  }

  function reject(reason) {
    if (that.status === PENDING) {
      that.status = REJECTED;
      that.reason = reason;
      that.onRejectedCbs.forEach((fn) => fn(that.reason));
    }
  }

  try {
    fn(resolve, reject);
  } catch (err) {
    reject(err);
  }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  let realOnFulfilled = onFulfilled;
  if (typeof realOnFulfilled !== "function") {
    realOnFulfilled = (value) => value;
  }

  let realOnRejected = onRejected;
  if (typeof realOnRejected !== "function") {
    realOnRejected = (reason) => {
      throw new Error(reason);
    };
  }

  if (this.status === FULFILLED) {
    // onFulfilled(this.value); // 在不管then返回值时可以只有这句。考虑then返回值，就不能只单纯运行onXXX了。
    let promise2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (typeof onFulfilled !== "function") {
            resolve(this.value);
          } else {
            let x = realOnFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          }
        } catch (err) {
          reject(err);
        }
      }, 0);
    });
    return promise2;
  }

  if (this.status === REJECTED) {
    // onRejected(this.reason);
    let promise2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (typeof onRejected !== "function") {
            reject(this.reason);
          } else {
            let x = realOnRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          }
        } catch (err) {
          reject(err);
        }
      }, 0);
    });
    return promise2;
  }

  if (this.status === PENDING) {
    const promise2 = new Promise(function (resolve, reject) {
      this.onFulfilledCallbacks.push(() => {
        setTimeout(function () {
          try {
            if (typeof onFulfilled !== "function") {
              resolve(this.value);
            } else {
              var x = realOnFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
      this.onRejectedCallbacks.push(() => {
        setTimeout(function () {
          try {
            if (typeof onRejected !== "function") {
              reject(this.reason);
            } else {
              var x = realOnRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (error) {
            reject(error);
          }
        }, 0);
      });
    });

    return promise2;
  }
};

function resolvePromise(promise, x, resolve, reject) {
  // 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
  // 这是为了防止死循环
  if (promise === x) {
    return reject(new TypeError("chaining cycle"));
  }

  if (promise instanceof Promise) {
    // 如果 x 为 Promise ，则使 promise 接受 x 的状态
    // 也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
    // 这个if跟下面判断then然后拿到执行其实重复了，可有可无
    x.then((y) => resolvePromise(promise, y, resolve, reject), reject);
    // 如果 x 为对象或者函数
  } else if (typeof x === "object" || typeof x === "function") {
    if (x === null) return resolve(x);

    try {
      // 把 x.then 赋值给 then
      var then = x.then;
    } catch (err) {
      // 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      return reject(err);
    }

    // 如果 then 是函数
    if (typeof then === "function") {
      let called = false;
      // 将 x 作为函数的作用域 this 调用之
      // 传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise
      // 名字重名了，我直接用匿名函数了
      try {
        then.call(
          x,
          // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          (y) => {
            // 如果 resolvePromise 和 rejectPromise 均被调用，
            // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            // 实现这条需要前面加一个变量called
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (err) {
        // 如果调用 then 方法抛出了异常 e：
        // 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
        if (called) return;
        // 否则以 e 为据因拒绝 promise
        return reject(err);
      }
    } else {
      // 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x);
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve(x);
  }
}

Promise.resolve = function (param) {
  if (param instanceof Promise) return param;
  return new Promise((resolve) => resolve(param));
};

Promise.reject = function (reason) {
  return new Promise((resolve, reject) => reject(reason));
};

// Promise.all()方法接受一个数组作为参数，p1、p2、p3都是 Promise 实例，如果不是，就会先调用Promise.resolve方法，将参数转为 Promise 实例，再进一步处理。当p1, p2, p3全部resolve，大的promise才resolve，有任何一个reject，大的promise都reject。
Promise.all = function (list) {
  let resPromise = new Promise((resolve, reject) => {
    let count = 0;
    let res = [];
    let len = list.length;

    if (len === 0) return resolve(res);

    list.forEach((p, i) => {
      Promise.resolve(p).then(
        (value) => {
          count++;
          res[i] = value;
          if (count === len) {
            resolve(res);
          }
        },
        (reason) => {
          reject(reason);
        }
      );
    });
  });

  return resPromise;
};

Promise.race = function (list) {
  let resPromise = new Promise((resolve, reject) => {
    const len = list.length;
    if (len === 0) return resolve();

    for (let i = 0; i < len; i++) {
      Promise.resolve(list[i]).then(
        (value) => resolve(value),
        (reason) => reject(reason)
      );
    }
  });

  return resPromise;
};

Promise.prototype.catch = function (onRejected) {
  this.then(null, onRejected);
};

Promise.prototype.finally = function (fn) {
  return this.then(
    (value) => {
      return Promise.resolve(fn()).then(() => value);
    },
    (err) => {
      return Promise.resolve(fn()).then(() => {
        throw err;
      });
    }
  );
};

//====================================================
// retry & pool
//====================================================
function promiseRetry(url, options, delay, times) {
  let count = times;
  return new Promise((resolve, reject) => {
    const fn = () => {
      fetch(url, options)
        .then(resolve)
        .catch((err) => {
          if (count === 0) {
            reject(err);
          } else {
            setTimeout(() => {
              count--;
              fn();
            }, delay);
          }
        });
    };
    fn();
  });
}

async function asyncPool(poolLimit, array, iteratorFn) {
  const res = []; // 用于存放所有的promise实例
  const executing = []; // 用于存放目前正在执行的promise
  for (const item of array) {
    // 一进来先执行第一个
    // 防止回调函数返回的不是promise，使用Promise.resolve进行包裹
    const p = Promise.resolve(iteratorFn(item));
    res.push(p);
    // 当需要pool时
    if (poolLimit < array.length) {
      // e是一个新的promise，这个promise必须等到p完成才会生成
      // 通过then方法，指定当fulfilled后需要做的事，即将e自身从正在执行的promise列表executing中删除
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      // 正式将e丢到executing队列
      executing.push(e);
      // 当executing大于limit时，要限制并发
      if (executing.length >= poolLimit) {
        // await意味着要一直等到一个结果，否则不进入下一轮for
        // 利用Promise.race方法来获得并发池中某任务完成的信号
        // 一旦某个p状态变更，会立即执行上面then的回调，将对应的e从executing中删除
        // 再进入到下一次for循环时，excecuting已经腾出空间，将推入一个新promise(e)。此时executing又满了，继续await
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(res);
}
// to test
const timeout = (i) => {
  console.log("开始", i);
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(i);
      console.log("结束", i);
    }, i)
  );
};
(async () => {
  const res = await asyncPool(2, [1000, 5000, 3000, 2000], timeout);
  console.log(res);
})();
/**
代码核心思路：
先初始化 limit 个 promise 实例，将它们放到 executing 数组中
使用 Promise.race 等待这 limit 个 promise 实例的执行结果
一旦某一个 promise 的状态发生变更，就将其从 executing 中删除，然后再执行循环生成新的 promise，放入executing 中
重复2、3两个步骤，直到所有的 promise 都被执行完
最后使用 Promise.all 返回所有 promise 实例的执行结果
*/
// Call iterator (i = 1000)
// Call iterator (i = 5000)
// Pool limit of 2 reached, wait for the quicker one to complete...
// 1000 finishes
// Call iterator (i = 3000)
// Pool limit of 2 reached, wait for the quicker one to complete...
// 3000 finishes
// Call iterator (i = 2000)
// Itaration is complete, wait until running ones complete...
// 5000 finishes
// 2000 finishes
// Resolves, results are passed in given array order `[1000, 5000, 3000, 2000]`

//====================================================
// 乞丐版promise，仅实现链式调用
//====================================================
// ref: https://cloud.tencent.com/developer/article/1718707;
function MyPromise(fn) {
  this.cbs = [];
  const resolve = (value) => {
    setTimeout(() => {
      this.data = value;
      this.cbs.forEach((cb) => cb(value));
    });
  };
  fn(resolve);
}
MyPromise.prototype.then = function (onResolved) {
  return new MyPromise((resolve) => {
    this.cbs.push(() => {
      const res = onResolved(this.data);
      if (res instanceof MyPromise) {
        res.then(resolve);
      } else {
        resolve(res);
      }
    });
  });
};

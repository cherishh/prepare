Promise.all = function (list) {
  const resP = new Promise((resolve, reject) => {
    const res = [];
    const len = list.length;
    let count = 0;

    list.forEach((p, i) => {
      Promise.resolve(p)
        .then((val) => {
          res[i] = val;
          count++;
          if (count === len) {
            resolve(res);
          }
        })
        .catch((err) => reject(err));
    });
  });

  return resP;
};

Promise.race = function (list) {
  const resP = new Promise((resolve, reject) => {
    list.forEach((p, i) => {
      Promise.resolve(p)
        .then((val) => resolve(val))
        .catch((err) => reject(err));
    });
  });
  return resP;
};

Promise.prototype.finally = function (fn) {
  return this.then(
    (val) => {
      return Promise.resolve(fn()).then(() => val);
    },
    (err) => {
      return Promise.resolve(fn()).then(() => {
        throw err;
      });
    }
  );
};

const PromiseRetry = (url, options, times, ms) => {
  return new Promise((resolve, reject) => {
    let count = 0;
    const fn = () => {
      fetch(url, options)
        .then((res) => {
          return resolve(res);
        })
        .catch((err) => {
          if (count === times) {
            reject(err);
          }

          setTimeout(() => {
            fn();
            count++;
          }, ms);
        });
    };
    fn();
  });
};

async function promisePool(limit, arr, fn) {
  const res = [];
  const executing = [];
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    const p = Promise.resolve(fn(arr[i]));
    res.push(p);

    if (limit < len) {
      const e = p.then((val) => executing.splice(executing.indexOf(e, 1)));
      executing.push(e);
    }

    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(res);
}

function MyPromise(fn) {
  this.value = null;
  this.cbs = [];

  const resolve = (val) => {
    this.value = val;
    this.cbs.forEach((f) => f(val));
  };

  fn(resolve);
}

MyPromise.prototype.then = function (onFulfilled) {
  return new MyPromise((resolve) => {
    setTimeout(() => {
      this.cbs.push(() => {
        const res = onFulfilled(this.value);
        if (res instanceof MyPromise) {
          res.then(resolve);
        } else {
          resolve(res);
        }
      }, 0);
    });
  });
};

function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, val) => {
        if (val) {
          resolve(val);
        }
        if (err) {
          reject(err);
        }
      });
    });
  };
}

function curry(fn, ...args) {
  return args.length >= fn.length ? fn(...args) : curry.bind(null, fn, ...args);
}

function debounce(fn, ms) {
  let timer;
  var res;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      res = fn.call(null, ...args);
    }, ms);
    return res;
  };
}

function throttle(fn, gap) {
  let last = 0;
  return (...args) => {
    const now = +new Date();
    if (now - last >= gap) {
      fn(...args);
      last = now;
    }
  };
}

class Emitter {
  constructor() {
    this.cbs = {};
  }

  on(evt, cb) {
    if (!evt) this.cbs[evt] = [];
    this.cbs[evt].push(cb);
  }

  emit(evt, ...args) {
    if (!evt) return;
    this.cbs[evt].forEach((fn) => fn(...args));
  }

  off(evt, cb) {
    if (!evt) return;
    this.cbs[evt] = this.cbs[evt].filter((f) => f !== cb);
  }

  once(evt, cb) {
    if (!evt) this.cbs[evt] = [];
    const fn = (...args) => {
      cb(...args);
      this.off(evt, fn);
    };
    this.cbs[evt].push(fn);
  }
}

const createStore = (reducer, initState) => {
  let state = initState;
  let cbs = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    this.cbs.forEach((f) => f());
  };

  const subscribe = (fn) => {
    cbs.push(fn);
    return () => {
      cbs = cbs.filter((f) => f !== fn);
    };
  };

  return {
    getState,
    dispatch,
    subscribe
  };
};

const combineReducer = (reducerObj) => {
  const stateKeys = Object.keys(reducerObj);
  const reducer = (state, action) => {
    let newState = {};
    for (let i = 0; i < stateKeys.length; i++) {
      const key = stateKeys[i];
      const currReducer = reducerObj[key];
      const prevState = state[key];
      newState[key] = currReducer(prevState, action);
    }

    return newState;
  };

  return reducer;
};

const connect = (mapStateToProps, mapDispatchToProps) => {
  return function connectHOC(WrappedComponent) {
    return class extends React.Component {
      componentDidMount() {
        this.unsubscirbe = store.subscribe(this.handleUpdate);
      }

      componentWillUnmount() {
        this.unsubscirbe();
      }

      handleUpdate = () => {
        this.forceUpdate();
      };

      render() {
        <WrappedComponent
          {...this.props}
          {...mapStateToProps(store.getState(), this.props)}
          {...mapDispatchToProps(store.dispatch, this.props)}
        />;
      }
    };
  };
};

// ==========================
// algorithm
// ==========================
const twoSum = (nums, target) => {
  const map = new Map();

  nums.forEach((n, i) => {
    map.set(n, i);
  });

  // BUG this should be for
  nums.forEach((n, i) => {
    const diff = target - n;
    if (map.has(diff) && map.get(diff) !== i) {
      return [i, map.get(diff)];
    }
  });
};

const isValid = (str) => {
  const len = str.length;
  if (len % 2 !== 0) return false;
  const map = {
    "(": ")",
    "[": "]",
    "{": "}"
  };

  const arr = str.split("");
  const stack = [];

  for (let i = 0; i < len; i++) {
    if (map.hasOwnProperty(arr[i])) {
      stack.push(arr[i]);
    } else {
      if (stack.pop() !== map[arr[i]]) {
        return false;
      }
    }
  }

  return stack.length === 0;
};

const mergeTwoList = (node1, node2) => {
  if (!node1) return node2;
  if (!node2) return node1;

  if (node1.val <= node2.val) {
    node1.next = mergeTwoList(node1.next, node2);
    return node1;
  } else {
    node2.next = mergeTwoList(node1, node2.next);
    return node2;
  }
};

const mergeTwoArray = (arr1, m, arr2, n) => {
  const cpArr1 = [...arr1];
  let p1 = 0;
  let p2 = 0;
  let curr = 0;

  while (p1 < m || p2 < n) {
    if (p1 === m) {
      curr = arr2[p2];
      p2++;
    } else if (p2 === n) {
      curr = cpArr1[p1];
      p1++;
    } else if (cpArr1[p1] < arr2[p2]) {
      curr = cpArr1[p1];
      p1++;
    } else {
      curr = arr2[p2];
      p2++;
    }
    arr1[m + n - 1] = curr;
  }
};

const secondLarge = (list) => {
  let p1 = 0;
  let p2 = 0;
  for (let i = 0; i < list.length; i++) {
    if (p1 < list[i]) {
      p2 = p1;
      p1 = list[i];
    } else if (list[i] < p1 && list[i] > p2) {
      p2 = list[i];
    }
  }
  return p2;
};

const maxSubArray = (nums) => {
  if (nums.length === 1) {
    return nums[0];
  }

  let prev = 0;
  let ans = nums[0];
  nums.forEach((n) => {
    prev = Math.max(n, prev + n);
    ans = Math.max(prev, ans);
  });
  return ans;
};

const lengthOfLIS = (list) => {
  const dp = new Array(list.length).fill(1);
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < i; j++) {
      if (list[i] > list[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  return Math.max(...dp);
};

const palindrome0 = (n) => {
  if (n < 0) return false;
  const reversed = ("" + n).split("").reverse().join("");
  return reversed === "" + n;
};

const palindrome = (n) => {
  if (n < 0) return false;
  const len = ("" + n).length;
  const isOdd = len % 2;
  let front = ("" + n).split("").slice(0, Math.floor(len / 2));
  let last;
  if (isOdd) {
    last = ("" + n)
      .split("")
      .slice(Math.floor(len / 2))
      .shift()
      .reverse();
  } else {
    last = ("" + n)
      .split("")
      .slice(len / 2)
      .reverse();
  }
  return front.join("") === last.join("");
};

const isSymmetric = (root) => {
  const check = (n1, n2) => {
    if (!n1 && !n2) return true;
    if (!n1 || !n2) return false;
    return (
      n1.val === n2.val && check(n1.left, n2.right) && check(n1.right, n2.left)
    );
  };
  return check(root.left, root.right);
};

const maxTreeDepth = (root) => {
  if (!root) return 0;
  return Math.max(maxTreeDepth(root.left), maxTreeDepth(root.right)) + 1;
};

const invertTree = (root) => {
  if (!root) return null;
  let temp = root.left;
  root.left = root.right;
  root.right = temp;
  invertTree(root.left);
  invertTree(root.right);
  return root;
};

const mergeTree = (root1, root2) => {
  if ((root1 && !root2) || (!root1 && root2)) return root1;
  if (!root1 && root2) return root2;
  root1.val = root1.val + root2.val;
  root1.left = mergeTree(root1.left, root2.left);
  root1.right = mergeTree(root1.right, root2.right);
  return root1;
};

const invertNodeList = (node) => {
  if (!node || !node.next) return node;

  let curr = node;
  let prev = null;
  while (curr) {
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
};

const strAdd = (str1, str2) => {
  while (str1.length < str2.length) {
    str1 = "0" + str1;
  }
  while (str1.length > str2.length) {
    str2 = "0" + str2;
  }

  let res = "";
  let count = str1.length - 1;
  let flag = 0;
  while (count >= 0) {
    flag = Number(str1[count]) + Number(str2[count]) + flag;
    res = (flag % 10) + res;
    flag = flag > 10 ? 1 : 0;
    count--;
  }
  return flag === 1 ? "1" + res : res;
};

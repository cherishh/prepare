const sortBy = (prop) => (list) => list.sort((a, b) => a[prop] - b[prop]);

const uniq = (list, key) => {
  const obj = {};

  return list.filter((item) => {
    if (!obj[item[key]]) {
      obj[item[key]] = item;
      return true;
    } else {
      return false;
    }
  });
};

Function.prototype.call2 = function (context) {
  context.fn = this;
  const res = context.fn(...arguments);
  delete context.fn;
  return res;
};

function bind(fn, context) {
  return function () {
    fn.apply(context, arguments);
  };
}

function myInstanceOf(target, origin) {
  let proto = target.__proto__;
  while (true) {
    if (proto === null) {
      return false;
    }
    if (proto === origin.prototype) {
      return true;
    }
    proto = proto.__proto__;
  }
}

const reduce = (reducer, initVal, list) => {
  let acc = initVal;
  for (let i = 0; i < list.length; i++) {
    acc = reducer(acc, list[i]);
  }
  return acc;
};

class EventEmitter {
  constructor() {
    this.handlers = {};
  }

  on(eventName, cb) {
    if (!this.handlers[eventName]) this.handlers.eventName = [];
    this.handlers[eventName].push(cb);
  }

  emit(eventName, ...args) {
    if (this.handlers[eventName]) {
      this.handlers[eventName].forEach((fn) => fn(...args));
    }
  }

  off(eventName, cb) {
    if (!this.handlers[eventName]) return;
    this.handlers[eventName] = this.handlers[eventName].filter(
      (fn) => fn !== cb
    );
  }

  once(eventName, cb) {
    const wrapperFn = (...args) => {
      cb.apply(this, args);
      this.off(eventName, wrapperFn);
    };
    this.on(eventName, wrapperFn);
  }
}

const flatten = (list) => {
  const res = [];
  const fn = (l) => {
    if (l instanceof Array) {
      l.forEach((i) => fn(i));
    } else {
      res.push(l);
    }
  };
  list.forEach((i) => fn(i));
  return res;
};

function fib(n) {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return fib(n - 1) + fib(n - 2);
}

const fib2 = (n, curr = 0, next = 1) => {
  if (n === 0) return 0;
  if (n === 1) return next;
  return fib(n - 1, next, curr + next);
};

function* fibGen() {
  let [prev, curr] = [0, 1];
  while (true) {
    yield curr;
    [prev, curr] = [curr, curr + prev];
  }
}

const debounce = (fn, ms) => {
  let timer = null;
  let res;
  return function () {
    let that = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      res = fn.call(that, ...arguments);
    }, ms);
    return res;
  };
};

const throttle = (fn, ms) => {
  let last = 0;
  return function (...args) {
    let now = +new Date();
    if (now - last > ms) {
      last = now;
      fn.apply(this, args);
    }
  };
};

const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if ("isActiveClone" in obj) {
    throw new Error("循环引用");
  }

  let res;
  if (obj instanceof Date) {
    res = new Date(obj);
  } else {
    res = obj.constructor();
  }

  Object.keys(obj).forEach((key) => {
    obj.isActiveClone = null;
    res[key] = deepClone(obj[key]);
    delete obj.isActiveClone;
  });

  return res;
};

const isEq = (obj1, obj2) => {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
  Object.keys(obj1).forEach((key) => {
    if (obj2.hasOwnProperty(key)) {
      if (!Object.is(obj1[key], obj2[key])) return false;
    } else {
      return false;
    }
  });
  return true;
};

const deepEq = (obj1, obj2) => {
  function isObject(o) {
    if (o !== null && typeof o === "object") return true;
  }

  let key1 = Object.keys(obj1);
  let key2 = Object.keys(obj2);

  if (key1.length !== key2.length) return false;

  for (let key of key1) {
    const val1 = obj1[key];
    const val2 = obj2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (!areObjects && val1 !== val2) return false;
    if (areObjects && !deepEq(obj1[key], obj2[key])) return false;
  }
  return true;
};

function curry(fn, ...args) {
  return args.length >= fn.length ? fn(...args) : curry.bind(null, fn, ...args);
}

const fakeCurryAdd = (a) => {
  let sum = a || 0;
  return function fn(b) {
    if (!b) return sum;
    sum = a + b;
    return fn;
  };
};

const promisify = (fn) => {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, data) => {
        if (err) return reject(err);
        return resolve(data); //  or no return, just resovle(data);
      });
    });
  };
};

let timer = null;
function simulateInterval(fn, delay) {
  const run = () => {
    fn();
    timer = setTimeout(run, delay);
  };
  timer = setTimeout(run, delay);
}

// 手写迭代器
// 一个迭代器应该是一个返回了迭代器对象的函数/拥有next()方法的对象

// 一个永不停止的迭代器
/**
var it = idMaker();
it.next().value // 0
it.next().value // 1
it.next().value // 2
 */
function idMaker() {
  var index = 0;
  return {
    next: function () {
      return { value: index++, done: false };
    }
  };
}
// 对数组的一个迭代器
/**
var it = makeIterator(['a', 'b']);
it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }
 */
function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function () {
      return nextIndex < array.length
        ? { value: array[nextIndex++], done: false }
        : { value: undefined, done: true };
    }
  };
}

// ===============================
// 惰性函数，覆盖定义
function addEvent(type, ele, fn) {
  if (window.addEventListener) {
    addEvent = ele.addEventListener(type, fn, false);
  } else if (window.attachEvent) {
    addEvent = ele.attachEvent("on" + type, fn);
  }
  return addEvent(type, ele, fn);
}

function memorize(fn) {
  const cache = {};
  return (...args) => {
    let key = args.join(",");
    if (key in cache) {
      return cache[key];
    } else {
      cache[key] = fn(...args);
      return cache[key];
    }
  };
}

// Set 数据类型的模拟实现
(function (global) {
  function Set(data) {
    this._values = [];
    this.size = 0;

    data &&
      data.forEach(function (item) {
        this.add(item);
      }, this);
  }

  Set.prototype["add"] = function (value) {
    if (this._values.indexOf(value) == -1) {
      this._values.push(value);
      ++this.size;
    }
    return this;
  };

  Set.prototype["has"] = function (value) {
    return this._values.indexOf(value) !== -1;
  };

  Set.prototype["delete"] = function (value) {
    var idx = this._values.indexOf(value);
    if (idx == -1) return false;
    this._values.splice(idx, 1);
    --this.size;
    return true;
  };

  Set.prototype["clear"] = function (value) {
    this._values = [];
    this.size = 0;
  };

  Set.prototype["forEach"] = function (callbackFn, thisArg) {
    thisArg = thisArg || global;
    for (var i = 0; i < this._values.length; i++) {
      callbackFn.call(thisArg, this._values[i], this._values[i], this);
    }
  };

  Set.length = 0;

  global.Set = Set;
})(this);

const cartesian = (arr) => {
  return arr.reduce((acc, curr) => {
    return acc.flatMap((i) => {
      console.log(i, 222);
      return curr.map((j) => {
        console.log(j, 333);
        // or return [].concat(i, j);
        return [i, j].flat();
      });
    });
  });
};

// 链式调用 + 正则匹配 + sortBy
/**
var data = [
  {userId: 8,  title: 'title1'},
  {userId: 11, title: 'other'},
  {userId: 15, title: null},
  {userId: 19, title: 'title2'}
];
var find = function(origin) {
  // your code are here...
}
// 查找 data 中，符合条件的数据，并进行排序
var result = find(data).where({
  'title': /\d$/
}).orderBy('userId', 'desc');
console.log(result);// [{ userId: 19, title: 'title2'}, { userId: 8, title: 'title1' }];
 */
const find = (origin) => {
  var result = origin;
  var Truefind = function () {
    this.where = function (reg) {
      var dataKey = Object.keys(reg)[0];
      result = origin.filter((item) => {
        return item[dataKey] && item[dataKey].match(reg[dataKey]);
      });
      return this;
    };
    this.orderBy = function (title, order = "desc") {
      result.sort((a, b) => {
        return order === "desc" ? b[title] - a[title] : a[title] - b[title];
      });
      return result;
    };
  };
  var instance = new Truefind();
  return instance;
};

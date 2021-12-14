const sortBy = (prop) => (list) => list.sort((a, b) => a[prop] - b[prop]);

const uniq = (arr, prop) => {
  const o = {};

  return arr.filter((obj) => {
    if (!o[obj[prop]]) {
      o[obj[prop]] = obj;
      return true;
    } else {
      return false;
    }
  });
};

Function.prototype.call2 = function (ctx, ...args) {
  ctx.fn = this;
  const res = ctx.fn(...args);
  delete ctx.fn();
  return res;
};

function bind(fn, ctx, ...args) {
  return function () {
    return fn.call(ctx, ...args);
  };
}

const reduce = (reducer, init, list) => {
  let acc = init;
  list.forEach((item) => {
    acc = reducer(item, acc);
  });
  return acc;
};

class EventEmiter {
  constructor() {
    this.handlers = {};
  }

  on(evt, handler) {
    if (!this.handlers[evt]) {
      this.handlers[evt] = [];
    }
    this.handlers[evt].push(handler);
  }

  emit(evt, ...args) {
    if (!this.handlers[evt]) return;
    this.handlers[evt].forEach((fn) => fn(...args));
  }

  off(evt, handler) {
    this.handlers[evt] = this.handlers[evt].filter((fn) => fn !== handler);
  }

  once(evt, handler) {
    const fn = (...args) => {
      handler.apply(this, ...args);
      this.off(evt, fn);
    };
    this.handlers[evt].push(fn);
  }
}

const flatten = (list) => {
  const res = [];
  const fn = (l) => {
    if (Array.isArray(l)) {
      l.forEach((i) => fn(i));
    } else {
      res.push(l);
    }
  };
  list.forEach((item) => fn(item));
  return res;
};

const fib = (n) => {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return fib(n - 1) + fib(n - 2);
};

const debounce = (fn, delay) => {
  let timer = null;
  let res;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      res = fn(...args);
    }, delay);
    return res;
  };
};

const throttle = (fn, delay) => {
  let last = 0;
  return (...args) => {
    let now = +new Date();
    if (now - last > delay) {
      last = now;
      fn(...args);
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

const curry = (fn, ...args) => {
  const len = fn.length;
  if (args.length >= len) return fn(...args);
  return curry.bind(null, fn, ...args);
};

const fakeCurryAdd = (a) => {
  let sum = a || 0;
  return function fn(b) {
    if (!b) return sum;
    sum = a + b;
    return fn;
  };
};

const createStore = (reducer) => {
  let state;
  let handlers = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    handlers.forEach((fn) => fn());
  };

  const subscribe = (cb) => {
    handlers.push(cb);
    return () => {
      handlers.filter((fn) => fn !== cb);
    };
  };
};

const combineReducers = (reducerObj) => {
  const keys = Object.keys(reducerObj);
  const reducer = (state, action) => {
    const newState = {};

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const currReducer = reducerObj[key];
      const prevState = state[key];
      newState[key] = currReducer(prevState, action);
    }

    return newState;
  };

  return reducer;
};

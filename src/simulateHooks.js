// https://jacky-summer.github.io/2020/10/26/%E6%89%8B%E5%86%99%E6%A8%A1%E6%8B%9F%E5%AE%9E%E7%8E%B0-React-Hooks/
import { render } from "react-dom";
// useState
let memorizedState = [];
let index = 0;
const useState = (initState) => {
  let currIdx = index;
  memorizedState[currIdx] = memorizedState[currIdx] || initState;
  const setState = (newState) => {
    memorizedState[currIdx] = newState;
    render();
  };
  return [memorizedState[index++], setState];
};

// useReducer
let reducerState;

const useReducer = (reducer, initialArg, init) => {
  let initialState;
  if (init !== undefined) {
    initialState = init(initialArg); // 初始化函数赋值
  } else {
    initialState = initialArg;
  }

  const dispatch = (action) => {
    reducerState = reducer(reducerState, action);
    render();
  };
  reducerState = reducerState || initialState;
  return [reducerState, dispatch];
};

// useEffect
// 需要依赖useState
const useEffect = (callback, dependencies) => {
  if (memorizedState[index]) {
    // 不是第一次执行
    let lastDependencies = memorizedState[index]; // 依赖项数组
    let hasChanged = !dependencies.every(
      (item, index) => item === lastDependencies[index]
    ); // 循环遍历依赖项是否与上次的值相同
    if (hasChanged) {
      // 依赖项有改变就执行 callback 函数
      memorizedState[index++] = dependencies;
      setTimeout(callback); // 设置宏任务，在组件render之后再执行
    } else {
      index++; // 每个hook占据一个下标位置，防止顺序错乱
    }
  } else {
    // 第一次执行
    memorizedState[index++] = dependencies;
    setTimeout(callback);
  }
};

// useCallback
const useCallback = (callback, dependencies) => {
  if (memorizedState[index]) {
    // 不是第一次执行
    let [lastCallback, lastDependencies] = memorizedState[index];

    let hasChanged = !dependencies.every(
      (item, index) => item === lastDependencies[index]
    ); // 判断依赖值是否发生改变
    if (hasChanged) {
      memorizedState[index++] = [callback, dependencies];
      return callback;
    } else {
      index++;
      return lastCallback; // 依赖值不变，返回上次缓存的函数
    }
  } else {
    // 第一次执行
    memorizedState[index++] = [callback, dependencies];
    return callback;
  }
};

// useMemo
const useMemo = (memoFn, dependencies) => {
  if (memorizedState[index]) {
    // 不是第一次执行
    let [lastMemo, lastDependencies] = memorizedState[index];

    let hasChanged = !dependencies.every(
      (item, index) => item === lastDependencies[index]
    );
    if (hasChanged) {
      memorizedState[index++] = [memoFn(), dependencies];
      return memoFn();
    } else {
      index++;
      return lastMemo;
    }
  } else {
    // 第一次执行
    memorizedState[index++] = [memoFn(), dependencies];
    return memoFn();
  }
};

// useContext
const useContext = (context) => {
  return context._currentValue;
};

// useRef
let lastRef;
const useRef = (value) => {
  lastRef = lastRef || { current: value };
  return lastRef;
};
// other
function useRef2(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
// anyway 原理可以说是闭包，在外层（作用域链）保存了一个值

// usePrevious
const usePrevious = (val) => {
  let ref = useRef();
  useEffect(() => {
    ref.current = val;
  }, [val]);
  return ref.current;
};

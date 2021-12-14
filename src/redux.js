const createStore = (reducer) => {
  let state;
  let listeners = [];

  const getSate = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((fn) => fn());
  };

  const subscribe = (fn) => {
    listeners.push(fn);
    return () => listeners = listeners.filter((f) => f !== fn);
  };

  return {
    getSate,
    dispatch,
    subscribe,
  }
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

// applyMiddleware
//TODO

// ref: https://segmentfault.com/a/1190000023084074

// =================================================
// react-redux
// =================================================
// --> context.js
// import React from 'react';
// const ReactReduxContext = React.createContext();
// export default ReactReduxContext;

// import React from 'react';
// import ReactReduxContext from './Context';
// Provider 没有太复杂的内涵，只是简单利用了react的context API。先创建一个context，然后在Provider这个函数组件内使用它即可
function Provider(props) {
  const { store, children } = props;

  // 这是要传递的context
  const contextValue = { store };

  // 返回ReactReduxContext包裹的组件，传入contextValue
  // 里面的内容就直接是children，我们不动他
  return (
    <ReactReduxContext.Provider value={contextValue}>
      {children}
    </ReactReduxContext.Provider>
  );
}

// todo
function connect(mapStateToProps, mapDispatchToProps) {
  return function connectHOC(WrappedComponent) {
    function ConnectFunction(props) {
      const { ...wrapperProps } = props;
      const context = useContext(ReactReduxContext);
      const { store } = context;
      const state = store.getSate();

      const stateProps = mapStateToProps(state);
      const dispatchProps = mapDispatchToProps(store.dispatch);

      const actualChildProps = {
        ...stateProps,
        ...dispatchProps,
        ...wrapperProps
      };

      return <WrappedComponent {...actualChildProps}></WrappedComponent>;
    }
    return ConnectFunction;
  };
}

// ref: https://segmentfault.com/a/1190000023142285


// connect mental model from Dan
// connect() is a function that injects Redux-related props into your component.
// You can inject data and callbacks that change that data by dispatching actions.
function connect(mapStateToProps, mapDispatchToProps) {
  // It lets us inject component as the last step so people can use it as a decorator.
  // Generally you don't need to worry about it.
  return function (WrappedComponent) {
    // It returns a component
    return class extends React.Component {
      render() {
        return (
          // that renders your component
          <WrappedComponent
            {/* with its props  */}
            {...this.props}
            {/* and additional props calculated from Redux store */}
            {...mapStateToProps(store.getState(), this.props)}
            {...mapDispatchToProps(store.dispatch, this.props)}
          />
        )
      }
      
      componentDidMount() {
        // it remembers to subscribe to the store so it doesn't miss updates
        this.unsubscribe = store.subscribe(this.handleChange.bind(this))
      }
      
      componentWillUnmount() {
        // and unsubscribe later
        this.unsubscribe()
      }
    
      handleChange() {
        // and whenever the store state changes, it re-renders.
        this.forceUpdate()
      }
    }
  }
}

// This is not the real implementation but a mental model.
// It skips the question of where we get the "store" from (answer: <Provider> puts it in React context)
// and it skips any performance optimizations (real connect() makes sure we don't re-render in vain).

// The purpose of connect() is that you don't have to think about
// subscribing to the store or perf optimizations yourself, and
// instead you can specify how to get props based on Redux store state:

const ConnectedCounter = connect(
  // Given Redux state, return props
  state => ({
    value: state.counter,
  }),
  // Given Redux dispatch, return callback props
  dispatch => ({
    onIncrement() {
      dispatch({ type: 'INCREMENT' })
    }
  })
)(Counter)
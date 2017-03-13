import { applyMiddleware, createStore, compose } from 'redux';
import { wrapStore } from 'react-chrome-redux';
import thunk from 'redux-thunk';
import xhrMiddlewareCreator from 'redux-xhr-middleware';
import rootReducer from '../reducers';

const enhancer = compose(
  applyMiddleware(xhrMiddlewareCreator()),
  applyMiddleware(thunk)
);

export default function (initialState) {
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');

      store.replaceReducer(nextRootReducer);
    });
  }

  wrapStore(store, {portName: 'CIRCLE_CI_MONITOR'});

  return store;
}

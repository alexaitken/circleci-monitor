import { applyMiddleware, createStore, compose } from 'redux';
import { wrapStore } from 'react-chrome-redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

const enhancer = compose(
  applyMiddleware(thunk)
);

export default function (initialState) {
  return wrapStore(createStore(rootReducer, initialState, enhancer), {portName: 'CIRCLE_CI_MONITOR'});
}

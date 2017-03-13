import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  loaded: false,
  loading: false,
  signed_in: false
};

const actionsMap = {
  [ActionTypes.LOADING_USER](state, action) {
    return {
      ...state,
      loading: true
    };
  },
  [ActionTypes.USER_LOADED](state, action) {
    return {
      ...state,
      loading: false,
      loaded: true,
      signed_in: (action.payload.login ? true : false)
    };
  },
  [ActionTypes.USER_LOAD_ERROR](state, action) {
    return {
      ...state,
      loading: false,
      loaded: false,
      signed_in: false
    };
  },
};

export default function user(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}

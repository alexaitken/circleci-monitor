import * as types from '../constants/ActionTypes';

export function loadUser(project) {
  return {
    xhr: {
      url: 'https://circleci.com/api/v1/me',
      method: 'GET',
    },
    types: [
      types.LOADING_USER,
      types.USER_LOADED,
      types.USER_LOAD_ERROR
    ]
  }
}

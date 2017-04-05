import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  selected_project: null,
  loading: false,
  items: [
    { name: 'first-project' }
  ]
};

const actionsMap = {
  [ActionTypes.SELECT_PROJECT](state, action) {
    return {
      ...state,
      selected_project: action.project_name
    };
  },
  [ActionTypes.PROJECTS_LOADED](state, action) {
    return {
      ...state,
      items: Object.keys(action.payload).map((key) => {
        return {
          name: action.payload[key].reponame
        };
      })
    };
  },
};

export default function projects(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}

import * as types from '../constants/ActionTypes';

export function selectProject(project) {
  return {
    type: types.SELECT_PROJECT,
    project_name: project
  };
}

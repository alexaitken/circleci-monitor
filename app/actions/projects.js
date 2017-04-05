import * as types from '../constants/ActionTypes';

export function selectProject(project) {
  return {
    type: types.SELECT_PROJECT,
    project_name: project
  };
}

export function updateProjects() {
  return {
    xhr: {
      url: 'https://circleci.com/api/v1/projects',
      method: 'GET',
    },
    types: [
      types.LOADING_PROJECTS,
      types.PROJECTS_LOADED,
      types.PROJECTS_LOAD_ERROR
    ]
  }
}

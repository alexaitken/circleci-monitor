import { expect } from 'chai';
import * as types from '../../../app/constants/ActionTypes';
import projects from '../../../app/reducers/projects';

describe('projects reducer', () => {
  it('should handle initial state', () => {
    expect(
      projects(undefined, {})
    ).to.eql({
      selected_project: null,
      loading: false,
      items: [
        {
          name: 'first-project'
        }
      ]
    });
  });

  it('should handle SELECT_PROJECT', () => {
    expect(
      projects({selected_project: null}, {
        type: types.SELECT_PROJECT,
        project_name: 'first-project'
      })
    ).to.eql({
      selected_project: 'first-project',
    });
  });

  it('updates the project is when projects are loaded', () => {
    expect(
      projects({items: []}, {
        type: types.PROJECTS_LOADED,
        payload: {
          0: {
            reponame: 'first-project',
          },
          1: {
            reponame: 'second-project',
          },
          2: {
            reponame: 'thrid-project',
          },
          3: {
            reponame: 'fourth-project',
          },
        }
      })
    ).to.eql({
      items: [
        { name: 'first-project' },
        { name: 'second-project' },
        { name: 'thrid-project' },
        { name: 'fourth-project' }
      ]
    });
  });
});

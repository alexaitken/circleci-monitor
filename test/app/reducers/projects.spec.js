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
});

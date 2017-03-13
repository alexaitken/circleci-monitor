import { expect } from 'chai';
import * as types from '../../../app/constants/ActionTypes';
import * as actions from '../../../app/actions/projects';

describe('project actions', () => {
  it('selectProjects should create SELECT_PROJECT action', () => {
    expect(actions.selectProject('project-name')).to.eql({
      type: types.SELECT_PROJECT,
      project_name: 'project-name'
    });
  });
});

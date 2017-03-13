import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ProjectList from '../../../app/components/ProjectList';
import ProjectTab from '../../../app/components/ProjectTab';

function setup(projects = []) {
  const props = {
    projects: projects
  };

  const renderer = TestUtils.createRenderer();

  renderer.render(<ProjectList {...props} />);

  let output = renderer.getRenderOutput();

  return { props, output, renderer };
}

describe('ProjectTab component', () => {
  it('should render correctly', () => {
    const projects = [
      {
        name: 'first-project',
      },
      {
        name: 'second-project',
      },
    ]

    const { output } = setup(projects);

    expect(output.type).to.equal('div');
    expect(output.props.children.type).to.equal('ul');
    expect(output.props.children.props.children.length).to.equal(2);
    output.props.children.props.children.forEach((item, index) => {
      expect(item.type).to.equal(ProjectTab);
      expect(item.props.project).to.equal(projects[index]);
    });
  });
});

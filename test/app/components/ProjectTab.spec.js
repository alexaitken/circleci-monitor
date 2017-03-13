import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ProjectTab from '../../../app/components/ProjectTab';

function setup(editing = false) {
  const props = {
    project: {
      name: 'first-project',
    },
  };

  const renderer = TestUtils.createRenderer();

  renderer.render(<ProjectTab {...props} />);

  let output = renderer.getRenderOutput();

  return { props, output, renderer };
}

describe('ProjectTab component', () => {
  it('should render correctly', () => {
    const { output } = setup();

    expect(output.type).to.equal('li');
    expect(output.props.children).to.equal('first-project');
  });
});

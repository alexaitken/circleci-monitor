import React, { Component, PropTypes } from 'react';

export default class ProjectTab extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = { };
  }

  render() {
    const { project } = this.props;

    return (
      <li>{project.name}</li>
    );
  }
}

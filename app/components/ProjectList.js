import React, { Component, PropTypes } from 'react';
import ProjectTab from '../components/ProjectTab';

export default class ProjectList extends Component {
  static propTypes = {
    projects: PropTypes.array.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = { };
  }

  render() {
    const { projects } = this.props;

    return (
      <div>
        <ul>
          {projects.map(project =>
            <ProjectTab project={project}/>
          )}
        </ul>
      </div>
    );
  }
}

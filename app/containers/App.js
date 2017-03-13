import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ProjectList from '../components/ProjectList';
import * as CircleCiMonitorActions from '../actions/projects';

@connect(
  state => ({
    user: state.user,
    projects: state.projects,
  }),
  dispatch => ({
    actions: bindActionCreators(CircleCiMonitorActions, dispatch)
  })
)
export default class App extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    projects: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  render() {
    const { user, projects, actions } = this.props;

    if (!user.loaded) {
      return (
        <div>
          <span>hi</span>
        </div>
      );
    }
    return (
      <div>
        <ProjectList projects={projects.items}/>
      </div>
    );
  }
}

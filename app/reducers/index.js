import { combineReducers } from 'redux';
import projects from './projects';
import user from './user';

export default combineReducers({
  user,
  projects
});

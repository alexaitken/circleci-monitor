import { updateProjects } from '../actions/projects';

export default class ProjectUpdater {
  constructor(store) {
    this.store = store;
    this.updateThread = null
  }

  start() {
    this.store.subscribe(() => { this.storeChange() });
  }

  storeChange() {
    if (this.store.getState().user.loaded) {
      this.enableUpdaterThread();
    } else {
      this.disableUpdaterThread();
    }
  }

  enableUpdaterThread() {
    if (!this.updateThread) {
      this.updateThread = setInterval(() => { this.update(); }, 30000);
      this.update();
    }
  }

  disableUpdaterThread() {
    if (this.updaterThread) {
      clearInterval(this.updaterThread);
    }
  }

  update() {
    this.store.dispatch(updateProjects());
  }
}

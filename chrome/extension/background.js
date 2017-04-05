import { loadUser } from '../../app/actions/user';
import ProjectUpdater from '../../app/workers/ProjectUpdater';
const bluebird = require('bluebird');

global.Promise = bluebird;

function promisifier(method) {
  // return a function
  return function promisified(...args) {
    // which returns a promise
    return new Promise((resolve) => {
      args.push(resolve);
      method.apply(this, args);
    });
  };
}

function promisifyAll(obj, list) {
  list.forEach(api => bluebird.promisifyAll(obj[api], { promisifier }));
}

// let chrome extension api support Promise
promisifyAll(chrome, [
  'tabs',
  'windows',
  'browserAction'
]);

const createStore = require('../../app/store/configureStore');
const store = createStore();

const updater = new ProjectUpdater(store);
updater.start();

store.dispatch(loadUser());


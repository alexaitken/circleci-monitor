import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';

const createStore = require('../../app/store/configurePopupStore');
const store = createStore();

store.ready().then(() => {
  ReactDOM.render(
    <Root store={store} />,
    document.querySelector('#root')
  );
});

import {Store} from 'react-chrome-redux';

export default function () {
  return new Store({
    portName: 'CIRCLE_CI_MONITOR' // communication port name
  });
}

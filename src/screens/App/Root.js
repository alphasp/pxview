/* eslint react/prefer-stateless-function:0 */
import React, { Component } from 'react';
import { AppRegistry, Platform, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import App from './App';
import { LocalizationProvider } from '../../components/Localization';
import i18n from '../../common/helpers/i18n';
import configureStore from '../../common/store/configureStore';
// GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

const store = configureStore();

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-line no-undef
  [
    'assert',
    'clear',
    'count',
    'debug',
    'dir',
    'dirxml',
    'error',
    'exception',
    'group',
    'groupCollapsed',
    'groupEnd',
    'info',
    'log',
    'profile',
    'profileEnd',
    'table',
    'time',
    'timeEnd',
    'timeStamp',
    'trace',
    'warn',
  ].forEach(methodName => {
    // eslint-disable-next-line no-console
    console[methodName] = () => {};
  });
}

class Root extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      // StatusBar.setBarStyle('light-content', true)
      StatusBar.setBarStyle('default');
    }
  }

  render() {
    return (
      <Provider store={store}>
        <LocalizationProvider i18n={i18n}>
          <App />
        </LocalizationProvider>
      </Provider>
    );
  }
}

AppRegistry.registerComponent('PxView', () => Root);

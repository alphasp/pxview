/* eslint react/prefer-stateless-function:0 */
import 'react-native-gesture-handler'; // https://github.com/kmagiera/react-native-gesture-handler/issues/320
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from './App';
import { LocalizationProvider } from '../../components/Localization';
import Loader from '../../components/Loader';
import i18n from '../../common/helpers/i18n';
import configureStore from '../../common/store/configureStore';
// GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

const { store, persistor } = configureStore();

enableScreens();

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
  ].forEach((methodName) => {
    // eslint-disable-next-line no-console
    console[methodName] = () => {};
  });
}

// console.disableYellowBox = true;

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <LocalizationProvider i18n={i18n}>
          <SafeAreaProvider>
            <PersistGate loading={<Loader />} persistor={persistor}>
              <App />
            </PersistGate>
          </SafeAreaProvider>
        </LocalizationProvider>
      </Provider>
    );
  }
}

AppRegistry.registerComponent('PxViewR', () => Root);

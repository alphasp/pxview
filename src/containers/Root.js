/* eslint react/prefer-stateless-function:0 */
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import configureStore from '../common/store/configureStore';
// GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

const store = configureStore();
class Root extends Component {
  render() {
    return <App {...this.props} store={store} />;
  }
}

AppRegistry.registerComponent('pixiv', () => Root);

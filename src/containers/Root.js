/* eslint react/prefer-stateless-function:0 */
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
//import routes from '../routes';
import App from './App';
import configureStore from '../common/store/configureStore';
const store = configureStore();

class Root extends Component {
  render() {
    console.log('root');
    return (
      <App { ...this.props } store={ store } />
    );
  }
}

AppRegistry.registerComponent('pixiv', () => Root);


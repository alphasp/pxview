/* eslint react/prefer-stateless-function:0 */
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import isEmpty from 'lodash.isempty';
//import routes from '../routes';
import App from './App';
import configureStore from '../common/store/configureStore';
import { clearAllSearch, SortType } from '../common/actions/search';

const store = configureStore();

function select(state) {
  return state.routes.scene;
}

function observeStore(store, select, onChange) {
  let currentState;

  function handleChange() {
    let nextState = select(store.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  let unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}

observeStore(store, select, (state) => {
  if ((state.name === "trending") || (state.name === "tabs")) {
    const { searchNewest, searchOldest } = store.getState();
    if (!isEmpty(searchNewest)) {
      store.dispatch(clearAllSearch(SortType.DESC));
    }
    if (!isEmpty(searchOldest)) {
      store.dispatch(clearAllSearch(SortType.ASC));
    }
  }
});

class Root extends Component {
  render() {
    return (
      <App { ...this.props } store={ store } />
    );
  }
}

AppRegistry.registerComponent('pixiv', () => Root);


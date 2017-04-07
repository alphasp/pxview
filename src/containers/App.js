import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Navigator,
  DeviceEventEmitter,
} from 'react-native';
import { connect, Provider } from 'react-redux';
import Master from './Master';
import { resetError } from '../common/actions/error';

global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

class App extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      //StatusBar.setBarStyle('light-content', true)
      StatusBar.setBarStyle('default');
    }
  }

  handleOnSearchFieldFocus = (searchType) => {
    console.log('on focus ', searchType);
    //Actions.search();
  }
  handleOnChangeSearchText = (word) => {
    const { dispatch } = this.props;
    if (word.length > 1) {
      dispatch(fetchSearchAutoComplete(word));
    }
  }
  handleOnSubmitSearch = (word) => {
    console.log('submit ', word)
    if (word) {
      //Actions.searchResult({ word: word, type: ActionConst.REPLACE });
    }
  }

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <Master />
      </Provider>
    );
  }
}

export default connect()(App);
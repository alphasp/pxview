import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  ListView,
  RecyclerViewBackedScrollView,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions, ActionConst } from 'react-native-router-flux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';
import SearchAutoCompleteResult from '../components/SearchAutoCompleteResult';
import { fetchSearchAutoComplete, clearSearchAutoComplete } from '../common/actions/searchAutoComplete';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class Search extends Component {
  componentDidMount() {
    const { word, isRenderPlaceHolder } = this.props;
    Actions.refresh({
      renderTitle: () => {
        return (
          <Header>
            <SearchBar 
              enableBack={true} 
              autoFocus={true} 
              onSubmitEditing={this.handleOnSubmitSearch}
              onChangeText={this.handleOnChangeSearchText}
              onPressRemoveTag={this.handleOnPressRemoveTag}
              word={word}
              isRenderPlaceHolder={isRenderPlaceHolder}
            />
          </Header>
        )
      }
    });           
  }

  handleOnSearchFieldFocus = () => {
    console.log('on focus');
    Actions.search();
  }
  handleOnChangeSearchText = (word) => {
    const { dispatch } = this.props;
    if (word.length > 1) {
      dispatch(fetchSearchAutoComplete(word));
    }
    else {
      dispatch(clearSearchAutoComplete());
      //show history searches
    }
  }
  handleOnSubmitSearch = (word) => {
    word = word.trim();
    console.log('submit ', word)
    if (word) {
      Actions.searchResult({ word: word, type: ActionConst.REPLACE });
    }
  }

  handleOnPressAutoCompleteItem = (word) => {
    this.handleOnSubmitSearch(word);
  }

  handleOnPressRemoveTag = (index) => {
    const { word } = this.props;
    const newWord = word.split(' ').splice(index, 1).join(' ');
    if (newWord) {
      this.handleOnSubmitSearch(newWord);
    }
    else {
      Actions.pop();
    }
  }

  render() {
    const { searchAutoComplete } = this.props;
    return (
      <View style={styles.container} >
        <SearchAutoCompleteResult 
          searchAutoComplete={searchAutoComplete}
          onPressItem={this.handleOnPressAutoCompleteItem}
        />
      </View>
    );
  }
}

export default connect(state => {
  return {
    searchAutoComplete: state.searchAutoComplete
  }
})(Search);
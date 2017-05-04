import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  Platform,
  ListView,
  RecyclerViewBackedScrollView,
  RefreshControl,
  InteractionManager,
} from 'react-native';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import PXTabView from '../components/PXTabView';
import SearchAutoCompleteResult from './SearchAutoCompleteResult';
import SearchUsersAutoCompleteResult from './SearchUsersAutoCompleteResult';
import * as searchAutoCompleteActionCreators
  from '../common/actions/searchAutoComplete';
import * as searchUserAutoCompleteActionCreators
  from '../common/actions/searchUsersAutoComplete';
import * as searchHistoryActionCreators from '../common/actions/searchHistory';
import * as searchTypeActionCreators from '../common/actions/searchType';
import { SearchType } from '../common/actions/searchType';

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    // top: APPBAR_HEIGHT + STATUSBAR_HEIGHT,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#fff',
  },
});

class Search extends Component {
  constructor(props) {
    super(props);
    const { searchType } = props;
    this.state = {
      index: searchType === SearchType.USER ? 1 : 0,
      routes: [
        { key: '1', title: 'Illust/Manga' },
        { key: '2', title: 'User' },
      ],
    };
  }

  handleChangeTab = index => {
    const { setSearchType } = this.props;
    this.setState({ index });
    if (index === 1) {
      setSearchType(SearchType.USER);
    } else {
      setSearchType(SearchType.ILLUST);
    }
  };

  renderScene = ({ route, index }) => {
    const {
      word,
      searchAutoComplete,
      searchUsersAutoComplete,
      searchHistory,
    } = this.props;
    const { initIndex } = this.state;
    switch (route.key) {
      case '1':
        return (
          <SearchAutoCompleteResult
            searchAutoComplete={searchAutoComplete}
            searchHistory={searchHistory}
            onPressItem={this.handleOnPressAutoCompleteItem}
            onPressSearchHistoryItem={this.handleOnPressSearchHistoryItem}
            onPressRemoveSearchHistoryItem={
              this.handleOnPressRemoveSearchHistoryItem
            }
            onPressClearSearchHistory={this.handleOnPressClearSearchHistory}
            word={word}
          />
        );
      case '2':
        return (
          <SearchUsersAutoCompleteResult
            tabLabel="User"
            searchUsersAutoComplete={searchUsersAutoComplete}
            searchHistory={searchHistory}
            onPressItem={this.handleOnPressUser}
            onPressSearchHistoryItem={this.handleOnPressSearchHistoryItem}
            onPressRemoveSearchHistoryItem={
              this.handleOnPressRemoveSearchHistoryItem
            }
            onPressClearSearchHistory={this.handleOnPressClearSearchHistory}
            loadMoreItems={this.loadMoreUsers}
            word={word}
          />
        );
      default:
        return null;
    }
  };

  submitSearch = word => {
    word = word.trim();
    if (word) {
      const {
        navigation: { navigate, setParams },
        isPushNewSearch,
        searchType,
        onSubmitSearch,
        addSearchHistory,
      } = this.props;
      addSearchHistory(word);
      onSubmitSearch(word);
      console.log('submit search ', searchType, isPushNewSearch);
      if (isPushNewSearch) {
        navigate('SearchResult', { word, searchType });
      }
      // setTimeout(() => {
      //   setParams({
      //     isFocusSearchBar: false,
      //     word
      //   });
      // }, 0);
    }
  };

  handleOnPressAutoCompleteItem = word => {
    this.submitSearch(word);
  };

  handleOnPressSearchHistoryItem = word => {
    this.submitSearch(word);
  };

  handleOnPressUser = userId => {
    const { navigation, onSubmitSearch, addSearchHistory } = this.props;
    const { navigate } = navigation;
    // onSubmitSearch(word);
    navigate('UserDetail', { userId });
  };

  handleOnPressRemoveSearchHistoryItem = item => {
    const { removeSearchHistory } = this.props;
    removeSearchHistory(item);
  };

  handleOnPressClearSearchHistory = () => {
    const { clearSearchHistory } = this.props;
    clearSearchHistory();
  };

  loadMoreUsers = () => {
    const {
      fetchSearchUserAutoComplete,
      searchUsersAutoComplete: { nextUrl },
    } = this.props;
    if (nextUrl) {
      fetchSearchUserAutoComplete(null, nextUrl);
    }
  };

  render() {
    const {
      word,
      searchType,
      searchAutoComplete,
      searchUsersAutoComplete,
      searchHistory,
    } = this.props;
    return (
      <View style={styles.container}>
        <PXTabView
          navigationState={{
            ...this.state,
            word,
            searchAutoComplete,
            searchUsersAutoComplete,
            searchHistory,
            searchType,
          }}
          renderScene={this.renderScene}
          onRequestChangeTab={this.handleChangeTab}
          lazy={false}
        />
      </View>
    );
  }
}

export default connect(
  (state, props) => {
    const { word, searchType } = props;
    return {
      searchAutoComplete: state.searchAutoComplete,
      searchUsersAutoComplete: state.searchUsersAutoComplete,
      searchHistory: state.searchHistory,
      word,
    };
  },
  {
    ...searchAutoCompleteActionCreators,
    ...searchUserAutoCompleteActionCreators,
    ...searchHistoryActionCreators,
    ...searchTypeActionCreators,
  },
)(Search);

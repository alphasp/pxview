import React, { Component } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { connect } from 'react-redux';
import SearchAutoCompleteResult from './SearchAutoCompleteResult';
import SearchUsersAutoCompleteResult from './SearchUsersAutoCompleteResult';
import { connectLocalization } from '../components/Localization';
import Pills from '../components/Pills';
import * as searchAutoCompleteActionCreators from '../common/actions/searchAutoComplete';
import * as searchUserAutoCompleteActionCreators from '../common/actions/searchUsersAutoComplete';
import * as searchHistoryActionCreators from '../common/actions/searchHistory';
import { SEARCH_TYPES, SCREENS } from '../common/constants';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    // top: APPBAR_HEIGHT + STATUSBAR_HEIGHT,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  pills: {
    padding: 10,
    ...Platform.select({
      ios: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(0, 0, 0, .3)',
      },
      android: {
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: StyleSheet.hairlineWidth,
        shadowOffset: {
          height: StyleSheet.hairlineWidth,
        },
        elevation: 4,
      },
    }),
  },
});

class Search extends Component {
  constructor(props) {
    super(props);
    const { searchType } = props;
    let index;
    switch (searchType) {
      case SEARCH_TYPES.ILLUST:
        index = 0;
        break;
      case SEARCH_TYPES.NOVEL:
        index = 1;
        break;
      case SEARCH_TYPES.USER:
        index = 2;
        break;
      default:
        break;
    }
    this.state = {
      index,
      searchType,
    };
  }

  submitSearch = (word) => {
    word = word.trim();
    if (word) {
      const { onSubmitSearch, addSearchHistory } = this.props;
      addSearchHistory(word);
      if (onSubmitSearch) {
        onSubmitSearch(word);
      }
    }
  };

  handleOnPressAutoCompleteItem = (word) => {
    this.submitSearch(word);
  };

  handleOnPressSearchHistoryItem = (word) => {
    this.submitSearch(word);
  };

  handleOnPressUser = (userId) => {
    const { navigation } = this.props;
    const { push } = navigation;
    push(SCREENS.UserDetail, { userId });
  };

  handleOnPressRemoveSearchHistoryItem = (item) => {
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

  handleOnPressPill = (index) => {
    const newState = {
      index,
    };
    if (index === 0) {
      newState.searchType = SEARCH_TYPES.ILLUST;
    } else if (index === 1) {
      newState.searchType = SEARCH_TYPES.NOVEL;
    } else {
      newState.searchType = SEARCH_TYPES.USER;
    }
    this.setState(newState);
    const { onChangePill } = this.props;
    if (onChangePill) {
      onChangePill(index);
    }
  };

  renderHeader = () => {
    const { i18n } = this.props;
    const { index } = this.state;
    return (
      <Pills
        items={[
          {
            title: i18n.illustManga,
          },
          {
            title: i18n.novel,
          },
          {
            title: i18n.user,
          },
        ]}
        onPressItem={this.handleOnPressPill}
        selectedIndex={index}
        style={styles.pills}
      />
    );
  };

  renderContent = () => {
    const { word, searchAutoComplete, searchUsersAutoComplete } = this.props;
    const { index } = this.state;
    switch (index) {
      case 0:
        return (
          <SearchAutoCompleteResult
            searchAutoComplete={searchAutoComplete}
            onPressItem={this.handleOnPressAutoCompleteItem}
            onPressSearchHistoryItem={this.handleOnPressSearchHistoryItem}
            onPressRemoveSearchHistoryItem={
              this.handleOnPressRemoveSearchHistoryItem
            }
            onPressClearSearchHistory={this.handleOnPressClearSearchHistory}
            word={word}
          />
        );
      case 1:
        return (
          <SearchAutoCompleteResult
            searchAutoComplete={searchAutoComplete}
            onPressItem={this.handleOnPressAutoCompleteItem}
            onPressSearchHistoryItem={this.handleOnPressSearchHistoryItem}
            onPressRemoveSearchHistoryItem={
              this.handleOnPressRemoveSearchHistoryItem
            }
            onPressClearSearchHistory={this.handleOnPressClearSearchHistory}
            word={word}
          />
        );
      case 2:
        return (
          <SearchUsersAutoCompleteResult
            searchUsersAutoComplete={searchUsersAutoComplete}
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

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderContent()}
      </View>
    );
  }
}

export default connectLocalization(
  connect(
    (state, props) => {
      const { word } = props;
      return {
        searchAutoComplete: state.searchAutoComplete,
        searchUsersAutoComplete: state.searchUsersAutoComplete,
        word,
      };
    },
    {
      ...searchAutoCompleteActionCreators,
      ...searchUserAutoCompleteActionCreators,
      ...searchHistoryActionCreators,
    },
  )(Search),
);

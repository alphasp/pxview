import React, { Component } from 'react';
import { View, StyleSheet, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from '@react-navigation/compat';
import { withTheme } from 'react-native-paper';
import SearchHistory from '../components/SearchHistory';
import SearchUsersAutoCompleteList from '../components/SearchUsersAutoCompleteList';
import * as searchUsersAutoCompleteActionCreators from '../common/actions/searchUsersAutoComplete';
import { getSearchUsersAutoCompleteItems } from '../common/selectors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class SearchUsersAutoCompleteResult extends Component {
  componentDidMount() {
    const {
      searchUsersAutoComplete,
      word,
      clearSearchUsersAutoComplete,
    } = this.props;
    if (word !== searchUsersAutoComplete.word) {
      clearSearchUsersAutoComplete();
      InteractionManager.runAfterInteractions(() => {
        this.submitSearchUsersAutoComplete(word);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { word: prevWord } = this.props;
    const { word, clearSearchUsersAutoComplete } = nextProps;
    if (word && word !== prevWord) {
      clearSearchUsersAutoComplete();
      InteractionManager.runAfterInteractions(() => {
        this.submitSearchUsersAutoComplete(word);
      });
    }
  }

  loadMoreItems = () => {
    const {
      fetchSearchUsersAutoComplete,
      searchUsersAutoComplete: { nextUrl, loading },
    } = this.props;
    if (!loading && nextUrl) {
      fetchSearchUsersAutoComplete(null, nextUrl);
    }
  };

  handleOnRefresh = () => {
    const {
      word,
      fetchSearchUsersAutoComplete,
      clearSearchUsersAutoComplete,
    } = this.props;
    clearSearchUsersAutoComplete();
    fetchSearchUsersAutoComplete(word, null, true);
  };

  submitSearchUsersAutoComplete = word => {
    const { fetchSearchUsersAutoComplete } = this.props;
    if (word && word.length > 1) {
      fetchSearchUsersAutoComplete(word);
    }
  };

  render() {
    const {
      searchUsersAutoComplete,
      word,
      searchUsersAutoComplete: { loading, loaded },
      items,
      searchHistory,
      onPressItem,
      onPressSearchHistoryItem,
      onPressRemoveSearchHistoryItem,
      onPressClearSearchHistory,
      navigation,
      theme,
    } = this.props;
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {((!loaded && !loading) || !word) && (
          <SearchHistory
            items={searchHistory.items}
            onPressItem={onPressSearchHistoryItem}
            onPressRemoveSearchHistoryItem={onPressRemoveSearchHistoryItem}
            onPressClearSearchHistory={onPressClearSearchHistory}
          />
        )}
        {word && word.length > 1 ? (
          <SearchUsersAutoCompleteList
            data={{ ...searchUsersAutoComplete, items }}
            onPressItem={onPressItem}
            loadMoreItems={this.loadMoreItems}
            onRefresh={this.handleOnRefresh}
            navigation={navigation}
          />
        ) : null}
      </View>
    );
  }
}

export default withTheme(
  withNavigation(
    connect(
      (state, props) => ({
        searchUsersAutoComplete: state.searchUsersAutoComplete,
        items: getSearchUsersAutoCompleteItems(state, props),
      }),
      searchUsersAutoCompleteActionCreators,
    )(SearchUsersAutoCompleteResult),
  ),
);

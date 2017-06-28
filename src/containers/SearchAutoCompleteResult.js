import React, { Component } from 'react';
import { View, StyleSheet, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import SearchHistory from '../components/SearchHistory';
import SearchAutoCompleteList from '../components/SearchAutoCompleteList';
import * as searchAutoCompleteActionCreators
  from '../common/actions/searchAutoComplete';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class SearchAutoCompleteResult extends Component {
  componentDidMount() {
    const { word, clearSearchAutoComplete } = this.props;
    clearSearchAutoComplete();
    InteractionManager.runAfterInteractions(() => {
      this.submitSearchAutoComplete(word);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { word: prevWord } = this.props;
    const { word, clearSearchAutoComplete } = nextProps;
    if (word && word !== prevWord) {
      clearSearchAutoComplete();
      InteractionManager.runAfterInteractions(() => {
        this.submitSearchAutoComplete(word);
      });
    }
  }

  submitSearchAutoComplete = word => {
    const { fetchSearchAutoComplete, user } = this.props;
    if (user && word && word.length > 1) {
      fetchSearchAutoComplete(word);
    }
  };

  render() {
    const {
      user,
      searchAutoComplete,
      word,
      searchAutoComplete: { loading, loaded },
      searchHistory,
      onPressItem,
      onPressSearchHistoryItem,
      onPressRemoveSearchHistoryItem,
      onPressClearSearchHistory,
    } = this.props;
    return (
      <View style={styles.container}>
        {((!loaded && !loading) || !word) &&
          <SearchHistory
            items={searchHistory.items}
            onPressItem={onPressSearchHistoryItem}
            onPressRemoveSearchHistoryItem={onPressRemoveSearchHistoryItem}
            onPressClearSearchHistory={onPressClearSearchHistory}
          />}
        {user && word && word.length > 1
          ? <SearchAutoCompleteList
              data={searchAutoComplete}
              onPressItem={onPressItem}
            />
          : null}
      </View>
    );
  }
}

export default connect(
  state => ({
    searchAutoComplete: state.searchAutoComplete,
    user: state.auth.user,
  }),
  searchAutoCompleteActionCreators,
)(SearchAutoCompleteResult);

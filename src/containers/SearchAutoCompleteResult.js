import React, { Component } from 'react';
import { View, StyleSheet, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-paper';
import SearchHistory from '../components/SearchHistory';
import SearchAutoCompleteList from '../components/SearchAutoCompleteList';
import * as searchAutoCompleteActionCreators from '../common/actions/searchAutoComplete';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class SearchAutoCompleteResult extends Component {
  componentDidMount() {
    const { searchAutoComplete, word, clearSearchAutoComplete } = this.props;
    if (word !== searchAutoComplete.word) {
      clearSearchAutoComplete();
      InteractionManager.runAfterInteractions(() => {
        this.submitSearchAutoComplete(word);
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { word, clearSearchAutoComplete } = this.props;
    const { word: prevWord } = prevProps;

    if (word && word !== prevWord) {
      clearSearchAutoComplete();
      InteractionManager.runAfterInteractions(() => {
        this.submitSearchAutoComplete(word);
      });
    }
  }

  submitSearchAutoComplete = (word) => {
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
      onPressItem,
      onPressSearchHistoryItem,
      theme,
    } = this.props;
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {((!loaded && !loading) || !word) && (
          <SearchHistory onPressItem={onPressSearchHistoryItem} />
        )}
        {user && word && word.length > 1 ? (
          <SearchAutoCompleteList
            data={searchAutoComplete}
            onPressItem={onPressItem}
          />
        ) : null}
      </View>
    );
  }
}

export default withTheme(
  connect(
    (state) => ({
      searchAutoComplete: state.searchAutoComplete,
      user: state.auth.user,
    }),
    searchAutoCompleteActionCreators,
  )(SearchAutoCompleteResult),
);

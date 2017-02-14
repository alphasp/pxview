import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  InteractionManager
} from 'react-native';
import { connect } from 'react-redux';
import dismissKeyboard from 'dismissKeyboard';
import Loader from '../components/Loader';
import Separator from '../components/Separator';
import SearchHistory from '../components/SearchHistory';
import SearchAutoCompleteList from '../components/SearchAutoCompleteList';
import * as searchAutoCompleteActionCreators from '../common/actions/searchAutoComplete';

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
});

class SearchAutoCompleteResult extends Component {
  // componentDidMount() {
  //   const { word, clearSearchAutoComplete } = this.props;
  //   clearSearchAutoComplete();
  //   InteractionManager.runAfterInteractions(() => {
  //     this.submitSearchAutoComplete(word);
  //   });
  // }

  componentWillReceiveProps(nextProps) {
    const { word: prevWord, } = this.props;
    const { word, searchAutoComplete: { items }, clearSearchAutoComplete } = nextProps;
    if (word && word !== prevWord) {
      clearSearchAutoComplete();
      InteractionManager.runAfterInteractions(() => {
        this.submitSearchAutoComplete(word);
      });
    }
  }
  
  submitSearchAutoComplete = (word) => {
    const { fetchSearchAutoComplete } = this.props;
    if (word && word.length > 1) {
      fetchSearchAutoComplete(word);
    }      
  }

  render() {
    const { searchAutoComplete, searchAutoComplete: { items, loading, loaded },  searchHistory, onPressItem, onPressSearchHistoryItem, onPressRemoveSearchHistoryItem, onPressClearSearchHistory } = this.props;
    console.log('sacr ', searchAutoComplete)
    return (
      <View style={styles.container}>
        {
          !loaded && !loading &&
          <SearchHistory 
            items={searchHistory.items}
            onPressItem={onPressSearchHistoryItem}
            onPressRemoveSearchHistoryItem={onPressRemoveSearchHistoryItem}
            onPressClearSearchHistory={onPressClearSearchHistory}
          />
        }
        {/*
          !loaded && loading &&
          <Loader />
        */}
        <SearchAutoCompleteList
          data={searchAutoComplete}
          onPressItem={onPressItem}
        />
      </View>
    );
  }
}

export default connect((state, props) => {
  return {
    searchAutoComplete: state.searchAutoComplete
  }
}, searchAutoCompleteActionCreators)(SearchAutoCompleteResult);
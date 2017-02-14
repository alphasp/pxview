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
import SearchUserAutoCompleteList from '../components/SearchUserAutoCompleteList';
import * as searchUserAutoCompleteActionCreators from '../common/actions/searchUserAutoComplete';

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
});

class SearchUserAutoCompleteResult extends Component {
  // componentDidMount() {
  //   const { word, clearSearchUserAutoComplete } = this.props;
  //   InteractionManager.runAfterInteractions(() => {
  //     clearSearchUserAutoComplete();
  //     this.submitSearchUserAutoComplete(word);
  //   });
  // }

  componentWillReceiveProps(nextProps) {
    const { word: prevWord, } = this.props;
    const { word, searchUserAutoComplete: { items }, clearSearchUserAutoComplete } = nextProps;
    if (word && word !== prevWord) {
      InteractionManager.runAfterInteractions(() => {
        clearSearchUserAutoComplete();
        this.submitSearchUserAutoComplete(word);
      });
    }
  }
  
  submitSearchUserAutoComplete = (word) => {
    const { fetchSearchUserAutoComplete } = this.props;
    if (word && word.length > 1) {
      fetchSearchUserAutoComplete(word);
    }      
  }

  render() {
    const { searchUserAutoComplete, searchUserAutoComplete: { items, loading, loaded },  searchHistory, onPressItem, onPressSearchHistoryItem, onPressRemoveSearchHistoryItem, onPressClearSearchHistory } = this.props;
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
        <SearchUserAutoCompleteList
          data={searchUserAutoComplete}
          onPressItem={onPressItem}
        />
      </View>
    );
  }
}

export default connect((state, props) => {
  return {
    searchUserAutoComplete: state.searchUserAutoComplete
  }
}, searchUserAutoCompleteActionCreators)(SearchUserAutoCompleteResult);
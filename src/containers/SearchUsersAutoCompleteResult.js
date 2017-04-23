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
    const { word, clearSearchUsersAutoComplete } = this.props;
    InteractionManager.runAfterInteractions(() => {
      clearSearchUsersAutoComplete();
      this.submitSearchUsersAutoComplete(word);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { word: prevWord } = this.props;
    const { word, searchUsersAutoComplete: { items }, clearSearchUsersAutoComplete } = nextProps;
    if (word && word !== prevWord) {
      InteractionManager.runAfterInteractions(() => {
        clearSearchUsersAutoComplete();
        this.submitSearchUsersAutoComplete(word);
      });
    }
  }
  
  loadMoreItems = () => {
    const { fetchSearchUsersAutoComplete, searchUsersAutoComplete: { nextUrl, loading } } = this.props;
    console.log('loading ', loading, nextUrl)
    if (!loading && nextUrl) {
      console.log('load more ', nextUrl)
      fetchSearchUsersAutoComplete(null, nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { word, fetchSearchUsersAutoComplete, clearSearchUsersAutoComplete } = this.props;
    clearSearchUsersAutoComplete();
    fetchSearchUsersAutoComplete(word, null, true);
  }


  submitSearchUsersAutoComplete = (word) => {
    const { fetchSearchUsersAutoComplete } = this.props;
    if (word && word.length > 1) {
      fetchSearchUsersAutoComplete(word);
    }      
  }

  render() {
    const { searchUsersAutoComplete, word, searchUsersAutoComplete: { loading, loaded }, items, searchHistory, onPressItem, onPressSearchHistoryItem, onPressRemoveSearchHistoryItem, onPressClearSearchHistory } = this.props;
    return (
      <View style={styles.container}>
        {
          ((!loaded && !loading) || !word) &&
          <SearchHistory 
            items={searchHistory.items}
            onPressItem={onPressSearchHistoryItem}
            onPressRemoveSearchHistoryItem={onPressRemoveSearchHistoryItem}
            onPressClearSearchHistory={onPressClearSearchHistory}
          />
        }
        {
          word ?
          <SearchUsersAutoCompleteList
            data={{...searchUsersAutoComplete, items}}
            onPressItem={onPressItem}
            loadMoreItems={this.loadMoreItems}
            onRefresh={this.handleOnRefresh}
          />
          :
          null
        }
      </View>
    );
  }
}

export default connect((state, props) => {
  return {
    searchUsersAutoComplete: state.searchUsersAutoComplete,
    items: getSearchUsersAutoCompleteItems(state, props)
  }
}, searchUsersAutoCompleteActionCreators)(SearchUsersAutoCompleteResult);
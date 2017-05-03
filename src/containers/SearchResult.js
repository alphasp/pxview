import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  RecyclerViewBackedScrollView,
  RefreshControl,
  InteractionManager,
} from 'react-native';
import { connect } from 'react-redux';
import IllustList from '../components/IllustList';
import * as searchActionCreators from '../common/actions/search';
import { SORT_TYPES } from '../common/constants';
import { makeGetSearchItems } from '../common/selectors';

class SearchResult extends Component {
  componentDidMount() {
    const { clearSearch, navigationStateKey, word, options } = this.props;
    clearSearch(navigationStateKey);
    InteractionManager.runAfterInteractions(() => {
      this.search(word, options);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { options: prevOptions, word: prevWord } = this.props;
    const { clearSearch, navigationStateKey, word, options } = nextProps;
    if ((word && word !== prevWord) || (options && options !== prevOptions)) {
      console.log('word prevWord ', word, prevWord);
      console.log('options prevOptions ', options, prevOptions);
      clearSearch(navigationStateKey);
      this.search(word, options);
    }
  }

  loadMoreItems = () => {
    const { navigationStateKey, search: { nextUrl, loading }, word, options } = this.props;
    if (!loading && nextUrl) {
      console.log('load more ', nextUrl);
      this.search(word, options, nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { clearSearch, navigationStateKey, word, options } = this.props;
    clearSearch(navigationStateKey);
    this.search(word, options, null, true);
  }

  search = (word, options, nextUrl, refreshing) => {
    const { fetchSearch, navigationStateKey, search } = this.props;
    fetchSearch(navigationStateKey, word, options, nextUrl, refreshing);
  }

  render() {
    const { search, items, word, options, navigation, navigationStateKey } = this.props;
    return (
      <IllustList
        data={{ ...search, items }}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(() => {
  const getSearchItems = makeGetSearchItems();
  return (state, props) => {
    const { search } = state;
    const { navigationStateKey } = props;
    return {
      search: search[navigationStateKey],
      items: getSearchItems(state, props),
    };
  };
}, searchActionCreators)(SearchResult);

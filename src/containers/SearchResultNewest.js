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
import { fetchSearch, clearSearch, SortType } from '../common/actions/search';

class SearchResultNewest extends Component {
  constructor(props) {
    super(props);
    const { word } = props;
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch, word } = this.props;
    dispatch(clearSearch(word, null, SortType.DESC));
    InteractionManager.runAfterInteractions(() => {
      this.search(word);
    });
  }

  loadMoreItems = () => {
    const { dispatch, search, word } = this.props;
    console.log('load more ', search[word].nextUrl)
    if (search[word] && search[word].nextUrl) {
      this.search(word, null, search[word].nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { dispatch, word } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearSearch(word, null, SortType.DESC));
    this.search(word, null, null).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  search = (word, options, nextUrl) => {
    const { dispatch, search } = this.props;
    return dispatch(fetchSearch(word, options, SortType.DESC, nextUrl, search));
  }

  render() {
    const { search, word, options } = this.props;
    const { refreshing } = this.state;
    console.log('ss ', search)
    return (
      (search[word] ? true : false) &&
      <IllustList
        data={search[word]}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(state => {
  return {
    search: state.searchNewest,
  }
})(SearchResultNewest);
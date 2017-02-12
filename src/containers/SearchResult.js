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

class SearchResult extends Component {
  constructor(props) {
    super(props);
    const { word } = props;
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch, navigationStateKey, sortType, word, options } = this.props;
    dispatch(clearSearch(navigationStateKey, sortType));
    InteractionManager.runAfterInteractions(() => {
      this.search(word, options);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { options: prevOptions, word: prevWord } = this.props;
    const { dispatch, navigationStateKey, sortType, word, options } = nextProps;
    if ((word !== prevWord) || (options && options !== prevOptions)) {
      const { dataSource } = this.state;
      dispatch(clearSearch(navigationStateKey, sortType));
      this.search(word, options);
    }
  }

  loadMoreItems = () => {
    const { dispatch, navigationStateKey, search, word } = this.props;
    console.log('load more ', search[navigationStateKey].nextUrl)
    if (search[navigationStateKey] && search[navigationStateKey].nextUrl) {
      this.search(word, null, search[navigationStateKey].nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { dispatch, navigationStateKey, sortType, word, options } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearSearch(navigationStateKey, sortType));
    this.search(word, options, null).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  search = (word, options, nextUrl) => {
    const { dispatch, navigationStateKey, sortType, search } = this.props;
    return dispatch(fetchSearch(navigationStateKey, word, options, sortType, nextUrl, search));
  }

  render() {
    console.log('sr ', this.props)
    const { search, word, options, navigation, navigationStateKey } = this.props;
    const { refreshing } = this.state;
    return (
      (search[navigationStateKey] ? true : false) &&
      <IllustList
        data={search[navigationStateKey]}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
        navigation={navigation}
      />
    );
  }
}

export default connect((state, props) => {
  return {
    search: state.search[props.sortType],
  }
})(SearchResult);
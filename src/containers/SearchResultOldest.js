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

class SearchResultOldest extends Component {
  constructor(props) {
    super(props);
    const { word } = props;
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch, word, options } = this.props;
    dispatch(clearSearch(word, null, SortType.ASC));
    InteractionManager.runAfterInteractions(() => {
      this.search(word, options);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { options: prevOptions } = this.props;
    const { dispatch, options, word } = nextProps;
    if (options && options !== prevOptions) {
      console.log('options ', options);
      console.log('prevOptions ', prevOptions);
      const { dataSource } = this.state;
      dispatch(clearSearch(word, null, SortType.ASC));
      console.log(console.log('receive new options ', options))
      this.search(word, options);
    }
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
    dispatch(clearSearch(word, null, SortType.ASC));
    this.search(word, { sort: 'date_asc' }, null).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  search = (word, options, nextUrl) => {
    const { dispatch, search } = this.props;
    return dispatch(fetchSearch(word, options, SortType.ASC, nextUrl, search));
  }

  render() {
    const { search, word, options } = this.props;
    const { refreshing } = this.state;
    console.log('render SearchResultOldest ')
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
    search: state.searchOldest,
  }
})(SearchResultOldest);
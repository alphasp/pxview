import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  RecyclerViewBackedScrollView,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import IllustList from '../components/IllustList';
import * as newIllustsActionCreators from '../common/actions/newIllusts';
import { denormalizedData } from '../common/helpers/normalizrHelper';
import Schemas from '../common/constants/schemas';

class NewIllusts extends Component {
  componentDidMount() {
    const { fetchNewIllusts } = this.props;
    fetchNewIllusts();
  }

  loadMoreItems = () => {
    const { fetchNewIllusts, newIllusts: { nextUrl, loading } } = this.props;
    if (!loading && nextUrl) {
      console.log('load more ', nextUrl)
      fetchNewIllusts(nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { fetchNewIllusts, clearNewIllusts } = this.props;
    clearNewIllusts();
    fetchNewIllusts(null, true);
  }

  render() {
    const { newIllusts } = this.props;
    return (
      <IllustList
        data={newIllusts}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(state => {
  const { entities, newIllusts } = state;
  return {
    newIllusts: denormalizedData(newIllusts, 'items', Schemas.ILLUST_ARRAY, entities)
  }
}, newIllustsActionCreators)(NewIllusts);
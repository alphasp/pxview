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
import * as newMangasActionCreators from '../common/actions/newMangas';
import { denormalizedData } from '../common/helpers/normalizrHelper';
import Schemas from '../common/constants/schemas';

class NewMangas extends Component {
  componentDidMount() {
    const { fetchNewMangas } = this.props;
    fetchNewMangas();
  }

  loadMoreItems = () => {
    const { fetchNewMangas, newMangas: { loading, nextUrl } } = this.props;
    if (!loading && nextUrl) {
      console.log('load more ', nextUrl)
      fetchNewMangas(nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { fetchNewMangas, clearNewMangas } = this.props;
    clearNewMangas();
    fetchNewMangas(null, true);
  }

  render() {
    const { newMangas } = this.props;
    return (
      <IllustList
        data={newMangas}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(state => {
  const { entities, newMangas } = state;
  return {
    newMangas: denormalizedData(newMangas, 'items', Schemas.ILLUST_ARRAY, entities)
  }
}, newMangasActionCreators)(NewMangas);
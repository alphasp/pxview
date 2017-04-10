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
import { denormalize } from 'normalizr';
import IllustList from '../components/IllustList';
import * as recommendedMangasActionCreators from '../common/actions/recommendedMangas';
import { denormalizedData } from '../common/helpers/normalizrHelper';
import Schemas from '../common/constants/schemas';

class RecommendedMangas extends Component {
  componentDidMount() {
    const { fetchRecommendedMangas } = this.props;
    fetchRecommendedMangas();
  }

  loadMoreItems = () => {
    const { recommendedMangas: { nextUrl }, fetchRecommendedMangas } = this.props;
    if (nextUrl) {
      fetchRecommendedMangas('', nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { fetchRecommendedMangas, clearRecommendedMangas } = this.props;
    clearRecommendedMangas();
    fetchRecommendedMangas(null, null, true);
  }

  render() {
    const { recommendedMangas } = this.props;
    return (
      <IllustList
        data={recommendedMangas}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(state => {
  const { entities, recommendedMangas } = state;
  return {
    recommendedMangas: denormalizedData(recommendedMangas, 'items', Schemas.ILLUST_ARRAY, entities),
  }
}, recommendedMangasActionCreators)(RecommendedMangas);
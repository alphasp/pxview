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
import * as recommendedMangasActionCreators
  from '../common/actions/recommendedMangas';
import { getRecommendedMangasItems } from '../common/selectors';

class RecommendedMangas extends Component {
  componentDidMount() {
    const { fetchRecommendedMangas } = this.props;
    fetchRecommendedMangas();
  }

  loadMoreItems = () => {
    const {
      recommendedMangas: { nextUrl, loading },
      fetchRecommendedMangas,
    } = this.props;
    if (!loading && nextUrl) {
      fetchRecommendedMangas('', nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { fetchRecommendedMangas, clearRecommendedMangas } = this.props;
    clearRecommendedMangas();
    fetchRecommendedMangas(null, null, true);
  };

  render() {
    const { recommendedMangas, items } = this.props;
    return (
      <IllustList
        data={{ ...recommendedMangas, items }}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  const { recommendedMangas } = state;
  return {
    recommendedMangas,
    items: getRecommendedMangasItems(state, props),
  };
}, recommendedMangasActionCreators)(RecommendedMangas);

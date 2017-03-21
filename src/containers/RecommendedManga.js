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
import * as recommendedMangaActionCreators from '../common/actions/recommendedManga';
import { denormalizedData } from '../common/helpers/normalizrHelper';
import Schemas from '../common/constants/schemas';

class RecommendedManga extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }
  componentDidMount() {
    const { fetchRecommendedMangas } = this.props;
    fetchRecommendedMangas();
  }

  loadMoreItems = () => {
    const { recommendedManga: { nextUrl }, fetchRecommendedMangas } = this.props;
    if (nextUrl) {
      fetchRecommendedMangas('', nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { fetchRecommendedMangas, clearRecommendedMangas } = this.props;
    this.setState({
      refereshing: true
    });
    clearRecommendedMangas();
    fetchRecommendedMangas().finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { recommendedManga, navigation } = this.props;
    const { refreshing } = this.state;
    return (
      <IllustList
        data={recommendedManga}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
        navigation={navigation}
      />
    );
  }
}

export default connect(state => {
  const { entities, recommendedManga } = state;
  return {
    recommendedManga: denormalizedData(recommendedManga, 'items', Schemas.ILLUST_ARRAY, entities),
  }
}, recommendedMangaActionCreators)(RecommendedManga);
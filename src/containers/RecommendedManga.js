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
import { fetchRecommendedMangas, clearRecommendedMangas } from '../common/actions/recommendedManga';
import { denormalize } from 'normalizr';
import Schemas from '../common/constants/schemas';

class RecommendedManga extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchRecommendedMangas());
  }

  loadMoreItems = () => {
    const { dispatch, recommendedManga: { nextUrl }, type } = this.props;
    if (nextUrl) {
      dispatch(fetchRecommendedMangas("", nextUrl));
    }
  }

  handleOnRefresh = () => {
    const { dispatch } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearRecommendedMangas());
    dispatch(fetchRecommendedMangas()).finally(() => {
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
  const denormalizedItems = denormalize(recommendedManga.items, Schemas.ILLUST_ARRAY, entities);
  return {
    recommendedManga: {
      ...recommendedManga,
      items: denormalizedItems
    }
  }
})(RecommendedManga);
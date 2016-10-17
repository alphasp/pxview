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
import Recommended from './Recommended';
import { fetchRecommendedMangas, clearRecommendedMangas } from '../common/actions/recommendedManga';

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
      dispatch(fetchRecommendedMangas(null, nextUrl));
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
    const { recommendedManga } = this.props;
    const { refreshing } = this.state;
    return (
      <Recommended
        recommended={recommendedManga}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(state => {
  return {
    recommendedManga: state.recommendedManga
  }
})(RecommendedManga);
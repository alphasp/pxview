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
import { fetchRecommendedIllust, fetchRecommendedIllustPublic, clearRecommended } from '../common/actions/recommendedIllust';

class RecommendedIllust extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchRecommendedIllustPublic());
  }

  loadMoreItems = () => {
    const { dispatch, recommendedIllust: { nextUrl } } = this.props;
    console.log('load more ', nextUrl)
    if (nextUrl) {
      dispatch(fetchRecommendedIllustPublic(null, nextUrl));
    }
  }

  handleOnRefresh = () => {
    const { dispatch } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearRecommended());
    dispatch(fetchRecommendedIllustPublic()).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { recommendedIllust } = this.props;
    const { refreshing } = this.state;
    return (
      <Recommended
        recommended={recommendedIllust}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(state => {
  return {
    recommendedIllust: state.recommendedIllust
  }
})(RecommendedIllust);
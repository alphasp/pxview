import React, { Component } from 'react';
import { connect } from 'react-redux';
import IllustList from '../components/IllustList';
import * as recommendedIllustsActionCreators from '../common/actions/recommendedIllusts';
import { denormalizedData } from '../common/helpers/normalizrHelper';
import Schemas from '../common/constants/schemas';

class RecommendedIllusts extends Component {
  componentDidMount() {
    const { fetchRecommendedIllusts } = this.props;
    fetchRecommendedIllusts();
  }

  componentWillReceiveProps(nextProps) {
    const { user: prevUser } = this.props;
    const { user, recommendedIllusts: { loading, items } } = nextProps;
    if ((!user && prevUser) || (user && !prevUser)) {
      const { fetchRecommendedIllusts, clearRecommendedIllusts } = this.props;
      clearRecommendedIllusts();
      fetchRecommendedIllusts();
    }
  }

  loadMoreItems = () => {
    const { recommendedIllusts: { nextUrl, loading }, fetchRecommendedIllusts } = this.props;
    if (!loading && nextUrl) {
      console.log('load more ', nextUrl)
      fetchRecommendedIllusts(null, nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { clearRecommendedIllusts, fetchRecommendedIllusts } = this.props;
    clearRecommendedIllusts();
    fetchRecommendedIllusts(null, null, true);
  }

  render() {
    const { recommendedIllusts } = this.props;
    return (
      <IllustList
        data={recommendedIllusts}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(state => {
  const { entities, recommendedIllusts, user } = state;
  return {
    recommendedIllusts: denormalizedData(recommendedIllusts, 'items', Schemas.ILLUST_ARRAY, entities),
    user: state.auth.user
  }
}, recommendedIllustsActionCreators)(RecommendedIllusts);
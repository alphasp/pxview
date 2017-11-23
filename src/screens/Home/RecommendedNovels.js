import React, { Component } from 'react';
import { connect } from 'react-redux';
import NovelList from '../../components/NovelList';
import * as recommendedNovelsActionCreators from '../../common/actions/recommendedNovels';
import { getRecommendedNovelsItems } from '../../common/selectors';

class RecommendedNovels extends Component {
  componentDidMount() {
    const { fetchRecommendedNovels, clearRecommendedNovels } = this.props;
    clearRecommendedNovels();
    fetchRecommendedNovels();
  }

  componentWillReceiveProps(nextProps) {
    const { user: prevUser } = this.props;
    const { user } = nextProps;
    if ((!user && prevUser) || (user && !prevUser)) {
      const { fetchRecommendedNovels, clearRecommendedNovels } = this.props;
      clearRecommendedNovels();
      fetchRecommendedNovels();
    }
  }

  loadMoreItems = () => {
    const {
      recommendedNovels: { nextUrl, loading },
      fetchRecommendedNovels,
    } = this.props;
    if (!loading && nextUrl) {
      fetchRecommendedNovels(null, nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { clearRecommendedNovels, fetchRecommendedNovels } = this.props;
    clearRecommendedNovels();
    fetchRecommendedNovels(null, null, true);
  };

  render() {
    const { recommendedNovels, items, listKey } = this.props;
    return (
      <NovelList
        data={{ ...recommendedNovels, items }}
        listKey={listKey}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  const { recommendedNovels, user } = state;
  return {
    recommendedNovels,
    items: getRecommendedNovelsItems(state, props),
    user,
    listKey: `${props.navigation.state.key}-recommendedNovels`,
  };
}, recommendedNovelsActionCreators)(RecommendedNovels);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import IllustTagList from '../../components/IllustTagList';
import * as trendingIllustTagsActionCreators from '../../common/actions/trendingIllustTags';
import { getTrendingIllustTagsItems } from '../../common/selectors';
import { SEARCH_TYPES } from '../../common/constants';

class TrendingIllustTags extends Component {
  componentDidMount() {
    const {
      trendingIllustTags: { loaded },
      fetchTrendingIllustTags,
      clearTrendingIllustTags,
    } = this.props;
    if (!loaded) {
      clearTrendingIllustTags();
      fetchTrendingIllustTags();
    }
  }

  handleOnRefresh = () => {
    const { fetchTrendingIllustTags, clearTrendingIllustTags } = this.props;
    clearTrendingIllustTags();
    fetchTrendingIllustTags(null, true);
  };

  render() {
    const { trendingIllustTags, items } = this.props;
    return (
      <IllustTagList
        data={{ ...trendingIllustTags, items }}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
        searchType={SEARCH_TYPES.ILLUST}
      />
    );
  }
}

export default connect((state) => {
  const { trendingIllustTags } = state;
  return {
    trendingIllustTags,
    items: getTrendingIllustTagsItems(state),
  };
}, trendingIllustTagsActionCreators)(TrendingIllustTags);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import IllustTagList from '../../components/IllustTagList';
import * as trendingNovelTagsActionCreators from '../../common/actions/trendingNovelTags';
import { getTrendingNovelTagsItems } from '../../common/selectors';
import { SEARCH_TYPES } from '../../common/constants';

class TrendingNovelTags extends Component {
  componentDidMount() {
    const {
      trendingNovelTags: { loaded },
      fetchTrendingNovelTags,
      clearTrendingNovelTags,
    } = this.props;
    if (!loaded) {
      clearTrendingNovelTags();
      fetchTrendingNovelTags();
    }
  }

  handleOnRefresh = () => {
    const { fetchTrendingNovelTags, clearTrendingNovelTags } = this.props;
    clearTrendingNovelTags();
    fetchTrendingNovelTags(null, true);
  };

  render() {
    const { trendingNovelTags, items } = this.props;
    return (
      <IllustTagList
        data={{ ...trendingNovelTags, items }}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
        searchType={SEARCH_TYPES.NOVEL}
      />
    );
  }
}

export default connect(
  state => {
    const { trendingNovelTags } = state;
    return {
      trendingNovelTags,
      items: getTrendingNovelTagsItems(state),
    };
  },
  trendingNovelTagsActionCreators,
)(TrendingNovelTags);

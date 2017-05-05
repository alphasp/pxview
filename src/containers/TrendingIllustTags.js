import React, { Component } from 'react';
import { connect } from 'react-redux';
import IllustTagList from '../components/IllustTagList';
import * as trendingIllustTagsActionCreators
  from '../common/actions/trendingIllustTags';
import { getTrendingIllustTagsItems } from '../common/selectors';

class TrendingIllustTags extends Component {
  componentDidMount() {
    const { fetchTrendingIllustTags } = this.props;
    fetchTrendingIllustTags();
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
      />
    );
  }
}

export default connect(state => {
  const { trendingIllustTags } = state;
  return {
    trendingIllustTags,
    items: getTrendingIllustTagsItems(state),
  };
}, trendingIllustTagsActionCreators)(TrendingIllustTags);

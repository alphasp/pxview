import React, { Component } from 'react';
import { connect } from 'react-redux';
import IllustTagList from '../components/IllustTagList';
import * as trendingIllustTagsActionCreators from '../common/actions/trendingIllustTags';
import { denormalizedData } from '../common/helpers/normalizrHelper';
import Schemas from '../common/constants/schemas';

class TrendingIllustTags extends Component {
  componentDidMount() {
    const { fetchTrendingIllustTags } = this.props; 
    fetchTrendingIllustTags();
  }
  
  handleOnRefresh = () => {
    const { fetchTrendingIllustTags, clearTrendingIllustTags } = this.props;
    clearTrendingIllustTags();
    fetchTrendingIllustTags(null, true);
  }

  handleOnPressItem = (item) => {
    const { navigate } = this.props.navigation;
    navigate('SearchResult', { word: item.tag });
  }
  render() {
    const { trendingIllustTags } = this.props;
    return (
      <IllustTagList
        data={trendingIllustTags}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  const { entities, trendingIllustTags } = state;
  return {
    trendingIllustTags: denormalizedData(trendingIllustTags, 'items', Schemas.ILLUST_TAG_ARRAY, entities),
  }
}, trendingIllustTagsActionCreators)(TrendingIllustTags);
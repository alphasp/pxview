import React, { Component } from 'react';
import { connect } from 'react-redux';
import IllustList from '../components/IllustList';
import * as recommendedIllustActionCreators from '../common/actions/recommendedIllust';
import { denormalizedData } from '../common/helpers/normalizrHelper';
import Schemas from '../common/constants/schemas';

class RecommendedIllust extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { fetchRecommendedIllusts } = this.props;
    fetchRecommendedIllusts();
  }

  loadMoreItems = () => {
    const { recommendedIllust: { nextUrl }, fetchRecommendedIllusts } = this.props;
    console.log('load more ', nextUrl)
    if (nextUrl) {
      fetchRecommendedIllusts('', nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { clearRecommendedIllusts, fetchRecommendedIllusts } = this.props;
    this.setState({
      refereshing: true
    });
    clearRecommendedIllusts();
    fetchRecommendedIllusts().finally(() => {
      this.setState({
        refereshing: false
      }); 
    });
  }

  render() {
    const { recommendedIllust, navigation } = this.props;
    const { refreshing } = this.state;
    return (
      <IllustList
        data={recommendedIllust}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
        navigation={navigation}
      />
    );
  }
}

export default connect(state => {
  const { entities, recommendedIllust } = state;
  return {
    recommendedIllust: denormalizedData(recommendedIllust, 'items', Schemas.ILLUST_ARRAY, entities),
  }
}, recommendedIllustActionCreators)(RecommendedIllust);
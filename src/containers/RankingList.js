import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  InteractionManager
} from 'react-native';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import IllustList from '../components/IllustList';
import * as rankingActionCreators from '../common/actions/ranking';
import Schemas from '../common/constants/schemas';

class RankingList extends Component {
  componentDidMount() {
    const { rankingMode, options, fetchRanking } = this.props;
    InteractionManager.runAfterInteractions(() => {
      fetchRanking(rankingMode, options);
    });
  }


  componentWillReceiveProps(nextProps) {
    const { options: prevOptions } = this.props;
    const { options, rankingMode, fetchRanking, clearRanking } = nextProps;
    if (options && ((options.mode !== prevOptions.mode) || (options.date !== prevOptions.date))) {
      InteractionManager.runAfterInteractions(() => {
        clearRanking(rankingMode);
        fetchRanking(rankingMode, options);
      });
    }
  }

  loadMoreItems = () => {
    const { ranking: { nextUrl, loading }, rankingMode, options, fetchRanking } = this.props;
    if (!loading && nextUrl) {
      console.log('load more ', nextUrl)
      fetchRanking(rankingMode, options, nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { rankingMode, fetchRanking, clearRanking } = this.props;
    clearRanking(rankingMode);
    fetchRanking(rankingMode, null, null, true);
  }

  render() {
    const { ranking } = this.props;
    return (
      <IllustList
        data={ranking}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  const { entities, ranking } = state;
  const denormalizedItems = denormalize(ranking[props.rankingMode].items, Schemas.ILLUST_ARRAY, entities);
  return {
    ranking: {
      ...ranking[props.rankingMode],
      items: denormalizedItems
    }
  }
}, rankingActionCreators)(RankingList);
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
import { RankingMode } from '../common/actions/ranking';
import Schemas from '../common/constants/schemas';

class RankingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

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
    const { ranking: { nextUrl }, rankingMode, options, fetchRanking } = this.props;
    console.log('load more ', nextUrl)
    if (nextUrl) {
      fetchRanking(rankingMode, options, nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { rankingMode, fetchRanking, clearRanking } = this.props;
    this.setState({
      refereshing: true
    });
    clearRanking(rankingMode);
    fetchRanking(rankingMode).finally(() => {
      this.setState({
        refereshing: false
      }); 
    });
  }

  render() {
    const { ranking } = this.props;
    const { refreshing } = this.state;
    return (
      <IllustList
        data={ranking}
        refreshing={refreshing}
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
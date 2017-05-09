import React, { Component } from 'react';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import IllustList from '../../components/IllustList';
import * as rankingActionCreators from '../../common/actions/ranking';
import { makeGetRankingItems } from '../../common/selectors';

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
    if (
      options &&
      (options.mode !== prevOptions.mode || options.date !== prevOptions.date)
    ) {
      InteractionManager.runAfterInteractions(() => {
        clearRanking(rankingMode);
        fetchRanking(rankingMode, options);
      });
    }
  }

  loadMoreItems = () => {
    const {
      ranking: { nextUrl, loading },
      rankingMode,
      options,
      fetchRanking,
    } = this.props;
    if (!loading && nextUrl) {
      console.log('load more ', nextUrl);
      fetchRanking(rankingMode, options, nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { rankingMode, fetchRanking, clearRanking } = this.props;
    clearRanking(rankingMode);
    fetchRanking(rankingMode, null, null, true);
  };

  render() {
    const { ranking, items } = this.props;
    return (
      <IllustList
        data={{ ...ranking, items }}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(() => {
  const getRankingItems = makeGetRankingItems();
  return (state, props) => {
    const { ranking } = state;
    return {
      ranking: ranking[props.rankingMode],
      items: getRankingItems(state, props),
    };
  };
}, rankingActionCreators)(RankingList);

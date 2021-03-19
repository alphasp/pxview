import React, { Component } from 'react';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import IllustList from '../../components/IllustList';
import * as rankingActionCreators from '../../common/actions/ranking';
import { makeGetIllustRankingItems } from '../../common/selectors';

class RankingList extends Component {
  static defaultProps = {
    reload: true,
  };

  componentDidMount() {
    const {
      ranking,
      rankingMode,
      reload,
      options,
      fetchRanking,
      clearRanking,
    } = this.props;
    if (!ranking || !ranking.items || reload) {
      clearRanking(rankingMode);
      InteractionManager.runAfterInteractions(() => {
        fetchRanking(rankingMode, options);
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { options, rankingMode, fetchRanking, clearRanking } = this.props;
    const { options: prevOptions } = prevProps;
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
      fetchRanking(rankingMode, options, nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { rankingMode, fetchRanking, clearRanking } = this.props;
    clearRanking(rankingMode);
    fetchRanking(rankingMode, null, null, true);
  };

  render() {
    const { ranking, items, listKey } = this.props;
    return (
      <IllustList
        data={{ ...ranking, items }}
        listKey={listKey}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(() => {
  const getRankingItems = makeGetIllustRankingItems();
  return (state, props) => {
    const { ranking } = state;
    return {
      ranking: ranking[props.rankingMode],
      items: getRankingItems(state, props),
      listKey: `${props.route.key}-${props.rankingMode}`,
    };
  };
}, rankingActionCreators)(RankingList);

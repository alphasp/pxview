import React, { Component } from 'react';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import IllustList from '../components/IllustList';
import * as rankingActionCreators from '../common/actions/ranking';
import { makeGetRankingItems } from '../common/selectors';

const ILLUST_COLUMNS = 3;

class TeaserList extends Component {
  scrollOffset = 0;

  componentDidMount() {
    const { rankingMode, options, fetchRanking, clearRanking } = this.props;
    InteractionManager.runAfterInteractions(() => {
      clearRanking(rankingMode);
      fetchRanking(rankingMode, options);
    });
  }

  handleOnListLayout = (e, listRef) => {
    const { items } = this.props;
    const heightPerRow = e.nativeEvent.layout.width / ILLUST_COLUMNS;
    const totalRow = Math.floor((items.length - 1) / ILLUST_COLUMNS) + 1;
    const totalRowHeight = heightPerRow * totalRow;
    const maxScrollableHeight = Math.max(
      totalRowHeight - e.nativeEvent.layout.height,
      0,
    );
    this.autoScroll(listRef, maxScrollableHeight);
    // console.log({
    //   maxScrollableHeight,
    //   totalRowHeight,
    //   totalRow,
    //   heightPerRow,
    //   itemsLength: items.length,
    // });
  };

  autoScroll = (listRef, maxScrollableHeight) => {
    if (this.scrollOffset >= maxScrollableHeight) {
      // console.log('done ', maxScrollableHeight);
      clearTimeout(this.autoScrollTimer);
    } else {
      listRef.scrollToOffset({
        animated: true,
        offset: (this.scrollOffset += 0.1),
      });
      this.autoScrollTimer = setTimeout(
        () => this.autoScroll(listRef, maxScrollableHeight),
        10,
      );
    }
  };

  componentWillUnmount() {
    if (this.autoScrollTimer) {
      clearTimeout(this.autoScrollTimer);
    }
  }

  render() {
    const { ranking, items } = this.props;
    console.log('items ', items.length)
    return (
      <IllustList
        data={{ ...ranking, items }}
        onListLayout={this.handleOnListLayout}
      />
    );
  }
}

export default connect(() => {
  const getRankingItems = makeGetRankingItems();
  return (state, props) => {
    const { ranking } = state;
    const items = getRankingItems(state, props);
    return {
      ranking: ranking[props.rankingMode],
      items:
        items && items.length && items.length % 3
          ? items.slice(0, items.length - 2)
          : items,
    };
  };
}, rankingActionCreators)(TeaserList);

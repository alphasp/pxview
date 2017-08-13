/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */

import React, { Component } from 'react';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import IllustList from '../components/IllustList';
import * as walkthroughIllustsActionCreators from '../common/actions/walkthroughIllusts';
import { getWalkthroughIllustsItems } from '../common/selectors';

const ILLUST_COLUMNS = 3;

class WalkthroughIllustList extends Component {
  scrollOffset = 0;

  componentDidMount() {
    const { fetchWalkthroughIllusts, clearWalkthroughIllusts } = this.props;
    InteractionManager.runAfterInteractions(() => {
      clearWalkthroughIllusts();
      fetchWalkthroughIllusts();
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
      clearTimeout(this.autoScrollTimer);
    } else if (listRef) {
      try {
        // listRef may not have reference of FlatList in certain situation
        listRef.scrollToOffset({
          animated: true,
          offset: (this.scrollOffset += 0.1),
        });
        this.autoScrollTimer = setTimeout(
          () => this.autoScroll(listRef, maxScrollableHeight),
          10,
        );
      } catch (e) {}
    }
  };

  componentWillUnmount() {
    if (this.autoScrollTimer) {
      clearTimeout(this.autoScrollTimer);
    }
  }

  render() {
    const { walkthroughIllusts, items, listKey } = this.props;
    return (
      <IllustList
        data={{ ...walkthroughIllusts, items }}
        listKey={listKey}
        onListLayout={this.handleOnListLayout}
      />
    );
  }
}

export default connect((state, props) => {
  const { walkthroughIllusts } = state;
  return {
    walkthroughIllusts,
    items: getWalkthroughIllustsItems(state, props),
    listKey: 'walkthroughIllustList',
  };
}, walkthroughIllustsActionCreators)(WalkthroughIllustList);

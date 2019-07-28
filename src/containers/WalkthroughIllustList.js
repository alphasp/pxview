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

  tmpFps = 0;

  fps = 0;

  last = 0;

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
    this.last = Date.now();
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
      cancelAnimationFrame(this.autoScrollTimer);
    } else if (listRef) {
      try {
        // listRef may not have reference of FlatList in certain situation
        if (this.fps > 30) {
          listRef.scrollToOffset({
            animated: false,
            offset: (this.scrollOffset += 30 / this.fps),
          });
        }
        this.autoScrollTimer = requestAnimationFrame(() => {
          const offset = Date.now() - this.last;
          this.tmpFps += 1;
          if (offset >= 1000) {
            this.fps = this.tmpFps / offset * 1000;
            this.last = Date.now();
            this.tmpFps = 0;
          }
          this.autoScroll(listRef, maxScrollableHeight);
        });
      } catch (e) {}
    }
  };

  componentWillUnmount() {
    if (this.autoScrollTimer) {
      cancelAnimationFrame(this.autoScrollTimer);
    }
  }

  render() {
    const { walkthroughIllusts, items, listKey } = this.props;
    return (
      <IllustList
        data={{ ...walkthroughIllusts, items }}
        listKey={listKey}
        onListLayout={this.handleOnListLayout}
        showsVerticalScrollIndicator={false}
        hideBookmarkButton
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

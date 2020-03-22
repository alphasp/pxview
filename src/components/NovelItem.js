import React, { Component } from 'react';
import { connect } from 'react-redux';
import NovelListViewItem from './NovelListViewItem';
import NovelGridViewItem from './NovelGridViewItem';
import { makeGetNovelItem } from '../common/selectors';

class NovelItem extends Component {
  shouldComponentUpdate(nextProps) {
    const {
      item: prevItem,
      isHighlight: prevIsHighlight,
      isMute: prevIsMute,
      isShowLikeCount: prevIsShowLikeCount,
    } = this.props;
    const { item, isHighlight, isMute, isShowLikeCount } = nextProps;
    // console.log(
    //   item.id,
    //   prevItem.is_bookmarked !== item.is_bookmarked ||
    //     prevItem.user.is_followed !== item.user.is_followed,
    // );
    return (
      prevItem.is_bookmarked !== item.is_bookmarked ||
      prevItem.user.is_followed !== item.user.is_followed ||
      prevIsHighlight !== isHighlight ||
      prevIsMute !== isMute ||
      prevIsShowLikeCount !== isShowLikeCount
    );
  }

  render() {
    const { gridView } = this.props;
    if (gridView) {
      return <NovelGridViewItem {...this.props} />;
    }
    return <NovelListViewItem {...this.props} />;
  }
}

export default connect(() => {
  const getNovelItem = makeGetNovelItem();
  return (state, props) => {
    const { highlightTags, muteTags, muteUsers, likeButtonSettings } = state;
    const item = getNovelItem(state, props);
    const { tags, user } = item;
    return {
      item,
      isHighlight: tags.some((t) => highlightTags.items.includes(t.name)),
      isMute:
        tags.some((t) => muteTags.items.includes(t.name)) ||
        muteUsers.items.some((m) => m === user.id),
      isShowLikeCount: likeButtonSettings.isShowLikeCount,
    };
  };
})(NovelItem);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import TagsFilterModal from '../components/TagsFilterModal';
import * as bookmarkNovelTagsActionCreators from '../common/actions/bookmarkNovelTags';

class NovelTagsFilterModal extends Component {
  componentDidMount() {
    const {
      fetchBookmarkNovelTags,
      clearBookmarkNovelTags,
      tagType,
    } = this.props;
    clearBookmarkNovelTags(tagType);
    fetchBookmarkNovelTags(tagType);
  }

  loadMoreItems = () => {
    const {
      bookmarkNovelTags: { nextUrl, loading },
      fetchBookmarkNovelTags,
      tagType,
    } = this.props;
    if (!loading && nextUrl) {
      fetchBookmarkNovelTags(tagType, nextUrl);
    }
  };

  render() {
    const {
      bookmarkNovelTags: { items },
      tag,
      isOpen,
      onSelectTag,
      onPressCloseButton,
    } = this.props;
    return (
      <TagsFilterModal
        items={items}
        tag={tag}
        isOpen={isOpen}
        onSelectTag={onSelectTag}
        onPressCloseButton={onPressCloseButton}
        onEndReached={this.loadMoreItems}
      />
    );
  }
}

export default connect(
  (state, props) => ({
    bookmarkNovelTags: state.bookmarkNovelTags[props.tagType],
  }),
  bookmarkNovelTagsActionCreators,
)(NovelTagsFilterModal);

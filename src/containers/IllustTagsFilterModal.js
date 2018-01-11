import React, { Component } from 'react';
import { connect } from 'react-redux';
import TagsFilterModal from '../components/TagsFilterModal';
import * as bookmarkIllustTagsActionCreators from '../common/actions/bookmarkIllustTags';

class IllustTagsFilterModal extends Component {
  componentDidMount() {
    const {
      fetchBookmarkIllustTags,
      clearBookmarkIllustTags,
      tagType,
    } = this.props;
    clearBookmarkIllustTags(tagType);
    fetchBookmarkIllustTags(tagType);
  }

  loadMoreItems = () => {
    const {
      bookmarkIllustTags: { nextUrl, loading },
      fetchBookmarkIllustTags,
      tagType,
    } = this.props;
    if (!loading && nextUrl) {
      fetchBookmarkIllustTags(tagType, nextUrl);
    }
  };

  render() {
    const {
      bookmarkIllustTags: { items },
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
    bookmarkIllustTags: state.bookmarkIllustTags[props.tagType],
  }),
  bookmarkIllustTagsActionCreators,
)(IllustTagsFilterModal);

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import BookmarkModal from './BookmarkModal';
import * as novelBookmarkDetailActionCreators from '../common/actions/novelBookmarkDetail';
import * as bookmarkNovelActionCreators from '../common/actions/bookmarkNovel';
import * as modalActionCreators from '../common/actions/modal';

class BookmarkNovelModal extends Component {
  static propTypes = {
    novelId: PropTypes.number.isRequired,
    isBookmark: PropTypes.bool.isRequired,
    fetchNovelBookmarkDetail: PropTypes.func.isRequired,
    clearNovelBookmarkDetail: PropTypes.func.isRequired,
    bookmarkNovel: PropTypes.func.isRequired,
    unbookmarkNovel: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const {
      novelId,
      fetchNovelBookmarkDetail,
      clearNovelBookmarkDetail,
    } = this.props;
    clearNovelBookmarkDetail(novelId);
    fetchNovelBookmarkDetail(novelId);
  }

  handleOnPressBookmarkButton = (novelId, bookmarkType, selectedTags) => {
    const { bookmarkNovel } = this.props;
    bookmarkNovel(novelId, bookmarkType, selectedTags);
    this.handleOnModalClose();
  };

  handleOnPressRemoveButton = novelId => {
    const { unbookmarkNovel } = this.props;
    unbookmarkNovel(novelId);
    this.handleOnModalClose();
  };

  handleOnModalClose = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  render() {
    const {
      novelBookmarkDetail: { item },
      novelId,
      isBookmark,
    } = this.props;
    return (
      <BookmarkModal
        item={item}
        id={novelId}
        isBookmark={isBookmark}
        onPressBookmark={this.handleOnPressBookmarkButton}
        onPressRemoveBookmark={this.handleOnPressRemoveButton}
        onModalClose={this.handleOnModalClose}
      />
    );
  }
}

export default connect(
  state => ({
    novelBookmarkDetail: state.novelBookmarkDetail,
  }),
  {
    ...novelBookmarkDetailActionCreators,
    ...bookmarkNovelActionCreators,
    ...modalActionCreators,
  },
)(BookmarkNovelModal);

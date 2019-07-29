import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import BookmarkModal from './BookmarkModal';
import * as illustBookmarkDetailActionCreators from '../common/actions/illustBookmarkDetail';
import * as bookmarkIllustActionCreators from '../common/actions/bookmarkIllust';
import * as modalActionCreators from '../common/actions/modal';

class BookmarkIllustModal extends Component {
  static propTypes = {
    illustId: PropTypes.number.isRequired,
    isBookmark: PropTypes.bool.isRequired,
    fetchIllustBookmarkDetail: PropTypes.func.isRequired,
    clearIllustBookmarkDetail: PropTypes.func.isRequired,
    bookmarkIllust: PropTypes.func.isRequired,
    unbookmarkIllust: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const {
      illustId,
      fetchIllustBookmarkDetail,
      clearIllustBookmarkDetail,
    } = this.props;
    clearIllustBookmarkDetail(illustId);
    fetchIllustBookmarkDetail(illustId);
  }

  handleOnPressBookmarkButton = (illustId, bookmarkType, selectedTags) => {
    const { bookmarkIllust } = this.props;
    bookmarkIllust(illustId, bookmarkType, selectedTags);
    this.handleOnModalClose();
  };

  handleOnPressRemoveButton = illustId => {
    const { unbookmarkIllust } = this.props;
    unbookmarkIllust(illustId);
    this.handleOnModalClose();
  };

  handleOnModalClose = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  render() {
    const {
      illustBookmarkDetail: { item },
      illustId,
      isBookmark,
    } = this.props;
    return (
      <BookmarkModal
        item={item}
        id={illustId}
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
    illustBookmarkDetail: state.illustBookmarkDetail,
  }),
  {
    ...illustBookmarkDetailActionCreators,
    ...bookmarkIllustActionCreators,
    ...modalActionCreators,
  },
)(BookmarkIllustModal);

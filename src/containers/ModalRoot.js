import React from 'react';
import { connect } from 'react-redux';
import FollowModal from './FollowModal';
import BookmarkIllustModal from './BookmarkIllustModal';
import BookmarkNovelModal from './BookmarkNovelModal';
import SignUpModal from './SignUpModal';

const MODAL_COMPONENTS = {
  FOLLOW: FollowModal,
  BOOKMARK_ILLUST: BookmarkIllustModal,
  BOOKMARK_NOVEL: BookmarkNovelModal,
  SIGNUP: SignUpModal,
};

const ModalRoot = ({ modal: { modalType, modalProps } }) => {
  if (!modalType) {
    return null;
  }
  const SpecificModal = MODAL_COMPONENTS[modalType];
  return <SpecificModal {...modalProps} />;
};

export default connect(state => ({
  modal: state.modal,
}))(ModalRoot);

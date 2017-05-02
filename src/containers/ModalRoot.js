import React, { Component } from 'react';
import { connect } from 'react-redux';
import FollowModal from './FollowModal';
import BookmarkModal from './BookmarkModal';

const MODAL_COMPONENTS = {
  FOLLOW: FollowModal,
  BOOKMARK: BookmarkModal,
};

class ModalRoot extends Component {
  render() {
    const { modalType, modalProps } = this.props.modal;
    if (!modalType) {
      return null;
    }
    const SpecificModal = MODAL_COMPONENTS[modalType];
    return <SpecificModal {...modalProps} />;
  }
}

export default connect(state => ({
  modal: state.modal,
}))(ModalRoot);

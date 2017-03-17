import React, { Component } from 'react';
import { connect } from 'react-redux';
import FollowModal from './FollowModal'
// import ConfirmLogoutModal from './ConfirmLogoutModal'

const MODAL_COMPONENTS = {
  'FOLLOW': FollowModal,
  // 'CONFIRM_LOGOUT': ConfirmLogoutModal,
  /* other modals */
}

class ModalRoot extends Component {
  render() {
    const { modalType, modalProps } = this.props.modal;
    if (!modalType) {
      return null;
    }
    const SpecificModal = MODAL_COMPONENTS[modalType];
    return <SpecificModal {...modalProps} />
  }
}

export default connect(state => {
  return {
    modal: state.modal
  }
})(ModalRoot);
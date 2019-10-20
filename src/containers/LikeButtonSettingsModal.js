import React, { Component } from 'react';
import { connect } from 'react-redux';
import { connectLocalization } from '../components/Localization';
import SingleChoiceDialog from '../components/SingleChoiceDialog';
import * as modalActionCreators from '../common/actions/modal';
import * as likeButtonSettingsActionCreators from '../common/actions/likeButtonSettings';
import { LIKE_BUTTON_ACTION_TYPES } from '../common/constants';

const actionList = [
  {
    id: LIKE_BUTTON_ACTION_TYPES.PUBLIC_LIKE,
  },
  {
    id: LIKE_BUTTON_ACTION_TYPES.PRIVATE_LIKE,
  },
  {
    id: LIKE_BUTTON_ACTION_TYPES.EDIT_LIKE,
  },
];

class LikeButtonSettingsModal extends Component {
  mapActionName = id => {
    const { i18n } = this.props;
    switch (id) {
      case LIKE_BUTTON_ACTION_TYPES.PUBLIC_LIKE:
        return i18n.likeButtonSettingsPublicLike;
      case LIKE_BUTTON_ACTION_TYPES.PRIVATE_LIKE:
        return i18n.likeButtonSettingsPrivateLike;
      case LIKE_BUTTON_ACTION_TYPES.EDIT_LIKE:
        return i18n.likeButtonSettingsEditLike;
      default:
        return '';
    }
  };

  mapItemsOptions = items =>
    items.map(item => ({ value: item.id, label: this.mapActionName(item.id) }));

  handleOnCancelPickerDialog = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  handleOnOkPickerDialog = value => {
    const { setLikeButtonAction } = this.props;
    setLikeButtonAction(value);
    this.handleOnCancelPickerDialog();
  };

  render() {
    const { i18n, actionType } = this.props;
    return (
      <SingleChoiceDialog
        visible
        title={i18n.likeButtonSettingsOnSingleTapLikeButtonAction}
        items={this.mapItemsOptions(actionList)}
        selectedItemValue={actionType}
        onPressOk={this.handleOnOkPickerDialog}
        onPressCancel={this.handleOnCancelPickerDialog}
      />
    );
  }
}

export default connectLocalization(
  connect(
    null,
    {
      ...modalActionCreators,
      ...likeButtonSettingsActionCreators,
    },
  )(LikeButtonSettingsModal),
);

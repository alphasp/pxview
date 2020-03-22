import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { withTheme, Switch } from 'react-native-paper';
import { connectLocalization } from '../../components/Localization';
import PXListItem from '../../components/PXListItem';
import * as modalActionCreators from '../../common/actions/modal';
import * as likeButtonSettingsActionCreators from '../../common/actions/likeButtonSettings';
import { MODAL_TYPES, LIKE_BUTTON_ACTION_TYPES } from '../../common/constants';
import { globalStyles } from '../../styles';

class LikeButtonSettings extends Component {
  handleOnPressOpenLikeSettingsModal = () => {
    const { openModal, actionType } = this.props;
    openModal(MODAL_TYPES.LIKE_BUTTON_SETTINGS, {
      actionType,
    });
  };

  mapActionName = () => {
    const { actionType, i18n } = this.props;
    switch (actionType) {
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

  handleOnSwitchIsShowLikeCount = () => {
    const { setSettings, isShowLikeCount } = this.props;
    setSettings({
      isShowLikeCount: !isShowLikeCount,
    });
  };

  render() {
    const { i18n, theme, isShowLikeCount } = this.props;
    return (
      <View
        style={[
          globalStyles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <PXListItem
          title={i18n.likeButtonSettingsOnSingleTapLikeButtonAction}
          description={this.mapActionName()}
          onPress={this.handleOnPressOpenLikeSettingsModal}
        />
        <PXListItem
          title={i18n.likeButtonSettingsShowLikeCount}
          right={() => (
            <Switch
              value={isShowLikeCount}
              onValueChange={this.handleOnSwitchIsShowLikeCount}
            />
          )}
        />
      </View>
    );
  }
}

export default withTheme(
  connectLocalization(
    connect(
      (state) => {
        const { actionType, isShowLikeCount } = state.likeButtonSettings;
        return {
          actionType,
          isShowLikeCount,
        };
      },
      { ...modalActionCreators, ...likeButtonSettingsActionCreators },
    )(LikeButtonSettings),
  ),
);

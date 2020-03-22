import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { withTheme, Switch } from 'react-native-paper';
import { connectLocalization } from '../../../components/Localization';
import PXListItem from '../../../components/PXListItem';
// import * as likeButtonSettingsActionCreators from '../../common/actions/likeButtonSettings';
import { SCREENS } from '../../../common/constants';
import { globalStyles } from '../../../styles';
import * as muteSettingsActionCreators from '../../../common/actions/muteSettings';

class MuteSettings extends Component {
  handleOnSwitchIsHideMute = () => {
    const { setSettings, isHideMute } = this.props;
    setSettings({
      isHideMute: !isHideMute,
    });
  };

  handleOnPressListItem = (type) => {
    const {
      navigation: { navigate },
    } = this.props;
    switch (type) {
      case 'tag': {
        navigate(SCREENS.MuteTagsSettings);
        break;
      }
      case 'user': {
        navigate(SCREENS.MuteUsersSettings);
        break;
      }
      default:
        break;
    }
  };

  render() {
    const { i18n, theme, isHideMute } = this.props;
    return (
      <View
        style={[
          globalStyles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <PXListItem
          title={i18n.tagMuteSettings}
          onPress={() => this.handleOnPressListItem('tag')}
        />
        <PXListItem
          title={i18n.userMuteSettings}
          onPress={() => this.handleOnPressListItem('user')}
        />
        <PXListItem
          title={i18n.muteSettingsHide}
          right={() => (
            <Switch
              value={isHideMute}
              onValueChange={this.handleOnSwitchIsHideMute}
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
        const { isHideMute } = state.muteSettings;
        return {
          isHideMute,
        };
      },
      muteSettingsActionCreators,
      // { ...modalActionCreators, ...likeButtonSettingsActionCreators },
    )(MuteSettings),
  ),
);

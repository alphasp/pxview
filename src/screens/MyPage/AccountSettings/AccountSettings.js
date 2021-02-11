import React, { Component } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-paper';
import AccountChangeEmailModal from '../../../containers/AccountChangeEmailModal';
import AccountChangePixivIdModal from '../../../containers/AccountChangePixivIdModal';
import AccountChangePasswordModal from '../../../containers/AccountChangePasswordModal';
import { connectLocalization } from '../../../components/Localization';
import PXListItem from '../../../components/PXListItem';
import Loader from '../../../components/Loader';
import * as authActionCreators from '../../../common/actions/auth';
import * as myAccountStateActionCreators from '../../../common/actions/myAccountState';
import { SCREENS } from '../../../common/constants';
import { globalStyleVariables } from '../../../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 15,
  },
  advanceSettingsContainer: {
    margin: 15,
    alignSelf: 'flex-end',
  },
  advanceSettings: {
    color: globalStyleVariables.PRIMARY_COLOR,
  },
});

class AccountSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenChangeEmailModal: false,
      isOpenChangePixivIdModal: false,
      isOpenChangePasswordModal: false,
    };
  }

  componentDidMount() {
    const { fetchMyAccountState, clearMyAccountState } = this.props;
    clearMyAccountState();
    fetchMyAccountState();
  }

  handleOnPressChangePixivId = () => {
    const {
      myAccountState: { item },
      i18n,
    } = this.props;
    if (item.can_change_pixiv_id && !item.has_changed_pixiv_id) {
      Alert.alert(
        i18n.formatString(
          i18n.accountSettingsChange,
          i18n.accountSettingsPixivId,
        ),
        i18n.accountSettingsChangePixivIdWarning,
        [
          { text: i18n.accountSettingsChangeNo },
          {
            text: i18n.accountSettingsChangeYes,
            onPress: this.openChangePixivIdModal,
          },
        ],
        { cancelable: false },
      );
    }
  };

  handleOnPressChangeEmail = () => {
    this.setState({
      isOpenChangeEmailModal: true,
    });
  };

  handleOnPressChangePassword = () => {
    this.setState({
      isOpenChangePasswordModal: true,
    });
  };

  handleOnCloseChangePasswordModal = () => {
    this.setState({
      isOpenChangePasswordModal: false,
    });
  };

  handleOnPressAdvancedSettings = () => {
    const { navigate } = this.props.navigation;
    navigate(SCREENS.AdvanceAccountSettings);
  };

  openChangePixivIdModal = () => {
    this.setState({
      isOpenChangePixivIdModal: true,
    });
  };

  handleOnCloseChangePixivIdModal = () => {
    this.setState({
      isOpenChangePixivIdModal: false,
    });
  };

  handleOnCloseChangeEmailModal = () => {
    this.setState({
      isOpenChangeEmailModal: false,
    });
  };

  renderList = () => {
    const { i18n, user, hideAdvanceSettings } = this.props;
    return (
      <View>
        <PXListItem
          title={i18n.accountSettingsEmail}
          description={user.mail_address || null}
          // onPress={this.handleOnPressChangeEmail}
        />
        <PXListItem
          title={i18n.accountSettingsPixivId}
          description={user.account}
          // onPress={this.handleOnPressChangePixivId}
        />
        <PXListItem
          title={i18n.password}
          description="******"
          // onPress={this.handleOnPressChangePassword}
        />
        {!hideAdvanceSettings && (
          <PXListItem
            title={i18n.accountSettingsAdvancedSettings}
            onPress={this.handleOnPressAdvancedSettings}
          />
        )}
      </View>
    );
  };

  render() {
    const {
      myAccountState: { loading },
      user,
      theme,
    } = this.props;
    const {
      isOpenChangePasswordModal,
      isOpenChangePixivIdModal,
      isOpenChangeEmailModal,
    } = this.state;
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {loading ? <Loader /> : this.renderList()}
        {isOpenChangeEmailModal && (
          <AccountChangeEmailModal
            onClose={this.handleOnCloseChangeEmailModal}
            user={user}
          />
        )}
        {isOpenChangePixivIdModal && (
          <AccountChangePixivIdModal
            onClose={this.handleOnCloseChangePixivIdModal}
            user={user}
          />
        )}
        {isOpenChangePasswordModal && (
          <AccountChangePasswordModal
            onClose={this.handleOnCloseChangePasswordModal}
          />
        )}
      </View>
    );
  }
}

export default withTheme(
  connectLocalization(
    connect(
      (state, props) => ({
        user: state.auth.user,
        modal: state.modal,
        myAccountState: state.myAccountState,
        hideAdvanceSettings:
          props.route.params && props.route.params.hideAdvanceSettings,
      }),
      {
        ...authActionCreators,
        ...myAccountStateActionCreators,
      },
    )(AccountSettings),
  ),
);

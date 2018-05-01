import React, { Component } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import AccountChangeEmailModal from '../../../containers/AccountChangeEmailModal';
import AccountChangePixivIdModal from '../../../containers/AccountChangePixivIdModal';
import AccountChangePasswordModal from '../../../containers/AccountChangePasswordModal';
import { connectLocalization } from '../../../components/Localization';
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
    const { myAccountState: { item }, i18n } = this.props;
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
      <List>
        <ListItem
          title={i18n.accountSettingsEmail}
          onPress={this.handleOnPressChangeEmail}
          rightTitle={user.mail_address || null}
          hideChevron
        />
        <ListItem
          title={i18n.accountSettingsPixivId}
          onPress={this.handleOnPressChangePixivId}
          rightTitle={user.account}
          hideChevron
        />
        <ListItem
          title={i18n.password}
          onPress={this.handleOnPressChangePassword}
          rightTitle="******"
          hideChevron
        />
        {!hideAdvanceSettings &&
          <ListItem
            title={i18n.accountSettingsAdvancedSettings}
            onPress={this.handleOnPressAdvancedSettings}
          />}
      </List>
    );
  };

  render() {
    const { myAccountState: { loading }, user } = this.props;
    const {
      isOpenChangePasswordModal,
      isOpenChangePixivIdModal,
      isOpenChangeEmailModal,
    } = this.state;
    return (
      <View style={styles.container}>
        {loading ? <Loader /> : this.renderList()}
        {isOpenChangeEmailModal &&
          <AccountChangeEmailModal
            onClose={this.handleOnCloseChangeEmailModal}
            user={user}
          />}
        {isOpenChangePixivIdModal &&
          <AccountChangePixivIdModal
            onClose={this.handleOnCloseChangePixivIdModal}
            user={user}
          />}
        {isOpenChangePasswordModal &&
          <AccountChangePasswordModal
            onClose={this.handleOnCloseChangePasswordModal}
          />}
      </View>
    );
  }
}

export default connectLocalization(
  connect(
    (state, props) => ({
      user: state.auth.user,
      modal: state.modal,
      myAccountState: state.myAccountState,
      hideAdvanceSettings:
        props.navigation.state.params &&
        props.navigation.state.params.hideAdvanceSettings,
    }),
    {
      ...authActionCreators,
      ...myAccountStateActionCreators,
    },
  )(AccountSettings),
);

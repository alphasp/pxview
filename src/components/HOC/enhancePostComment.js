import React, { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { connectLocalization } from '../Localization';
import * as verificationEmailActionCreators from '../../common/actions/verificationEmail';
import { SCREENS } from '../../common/constants';

const enhancePostComment = WrappedComponent => {
  class Hoc extends Component {
    checkIfUserEligibleToPostComment = () => {
      const { user, i18n } = this.props;
      if (!user.mail_address) {
        Alert.alert(
          i18n.commentAdd,
          i18n.commentRequireAccountRegistration,
          [
            { text: i18n.cancel },
            {
              text: i18n.commentRequireAccountRegistrationAction,
              onPress: this.handleOnPressRegisterAccount,
            },
          ],
          { cancelable: false },
        );
        return false;
      }
      if (user.mail_address && !user.is_mail_authorized) {
        Alert.alert(
          i18n.emailVerificationPostComment,
          null,
          [
            { text: i18n.cancel },
            {
              text: i18n.emailVerificationSend,
              onPress: this.handleOnPressSendVerificationEmail,
            },
          ],
          { cancelable: false },
        );
        return false;
      }
      return true;
    };

    handleOnPressSendVerificationEmail = () => {
      const { sendVerificationEmail } = this.props;
      sendVerificationEmail();
    };

    handleOnPressRegisterAccount = () => {
      const { navigate } = this.props.navigation;
      navigate(SCREENS.AccountSettingsModal, {
        hideAdvanceSettings: true,
      });
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          checkIfUserEligibleToPostComment={
            this.checkIfUserEligibleToPostComment
          }
        />
      );
    }
  }

  hoistNonReactStatic(Hoc, WrappedComponent);

  return connectLocalization(
    connect(
      state => {
        const { user } = state.auth;
        return {
          user,
          verificationEmail: state.verificationEmail,
        };
      },
      verificationEmailActionCreators,
    )(Hoc),
  );
};

export default enhancePostComment;

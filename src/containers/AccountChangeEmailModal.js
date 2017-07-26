import React, { Component } from 'react';
import { View, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { connectLocalization } from '../components/Localization';
import ModalForm from '../components/ModalForm';
import PXFormInput from '../components/PXFormInput';
import * as authActionCreators from '../common/actions/auth';
import * as modalActionCreators from '../common/actions/modal';
import * as editAccountActionCreators from '../common/actions/editAccount';

const FORM_ID = 'ChangeEmail';

const validate = (values, props) => {
  const { currentPassword, newPassword, email } = values;
  const { i18n, user } = props;
  const errors = {};
  if (user && user.isProvisionalAccount) {
    if (!newPassword) {
      errors.newPassword = i18n.accountSettingsValidatePasswordNew;
    }
  } else if (!currentPassword) {
    errors.currentPassword = i18n.accountSettingsValidatePassword;
  }
  if (!email) {
    errors.email = i18n.accountSettingsValidateEmail;
  }
  return errors;
};

class AccountChangeEmail extends Component {
  componentWillReceiveProps(nextProps) {
    const { editAccountState: { prevSuccess } } = this.props;
    const {
      editAccountState: { success },
      onClose,
      editAccountClear,
    } = nextProps;
    if (success && success !== prevSuccess) {
      onClose();
      editAccountClear();
    }
  }

  submit = data => {
    const { editAccount, user } = this.props;
    const { currentPassword, newPassword, email } = data;
    let password;
    if (user.isProvisionalAccount && user.password) {
      password = user.password;
    } else {
      password = currentPassword;
    }
    if (
      password &&
      (!user.isProvisionalAccount ||
        (user.isProvisionalAccount && newPassword)) &&
      email
    ) {
      Keyboard.dismiss();
      editAccount({
        formId: FORM_ID,
        email,
        currentPassword: password,
        newPassword,
      });
    }
  };

  render() {
    const {
      editAccountState: { loading },
      user,
      onClose,
      i18n,
      handleSubmit,
    } = this.props;
    return (
      <ModalForm
        title={i18n.formatString(
          i18n.accountSettingsChange,
          i18n.accountSettingsEmail,
        )}
        onSubmit={handleSubmit(this.submit)}
        onClose={onClose}
        loading={loading}
      >
        <View>
          {(!user.isProvisionalAccount || !user.password) &&
            <Field
              name="currentPassword"
              component={PXFormInput}
              label={i18n.password}
              secureTextEntry
            />}
          {user.isProvisionalAccount &&
            <Field
              name="newPassword"
              component={PXFormInput}
              label={i18n.accountSettingsPasswordNew}
              secureTextEntry
            />}
          <Field
            name="email"
            component={PXFormInput}
            label={i18n.accountSettingsEmail}
            autoCapitalize="none"
          />
        </View>
      </ModalForm>
    );
  }
}

const AccountChangeEmailForm = reduxForm({
  form: FORM_ID,
  validate,
})(AccountChangeEmail);

export default connectLocalization(
  connect(
    state => ({
      auth: state.auth,
      editAccountState: state.editAccount,
    }),
    {
      ...authActionCreators,
      ...modalActionCreators,
      ...editAccountActionCreators,
    },
  )(AccountChangeEmailForm),
);

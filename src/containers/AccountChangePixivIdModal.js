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

const FORM_ID = 'changePixivId';

const validate = (values, props) => {
  const { currentPassword, newPassword, pixivId } = values;
  const { i18n, user } = props;
  const errors = {};
  if (user && user.isProvisionalAccount) {
    if (!newPassword) {
      errors.newPassword = i18n.accountSettingsValidatePasswordNew;
    }
  } else if (!currentPassword) {
    errors.currentPassword = i18n.accountSettingsValidatePassword;
  }
  if (!pixivId) {
    errors.pixivId = i18n.accountSettingsValidatePixivId;
  }
  return errors;
};

class AccountChangePixivId extends Component {
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
    const { currentPassword, newPassword, pixivId } = data;
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
      pixivId
    ) {
      Keyboard.dismiss();
      editAccount({
        formId: FORM_ID,
        pixivId,
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
          i18n.accountSettingsPixivId,
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
            name="pixivId"
            component={PXFormInput}
            label={i18n.accountSettingsPixivId}
            autoCapitalize="none"
          />
        </View>
      </ModalForm>
    );
  }
}

const AccountChangePixivIdForm = reduxForm({
  form: FORM_ID,
  validate,
})(AccountChangePixivId);

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
  )(AccountChangePixivIdForm),
);

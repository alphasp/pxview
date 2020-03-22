import React, { Component } from 'react';
import { View, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { withFormik, Field } from 'formik';
import { connectLocalization } from '../components/Localization';
import ModalForm from '../components/ModalForm';
import PXFormInput from '../components/PXFormInput';
import * as modalActionCreators from '../common/actions/modal';
import * as editAccountActionCreators from '../common/actions/editAccount';

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

const handleOnSubmit = (values, { props }) => {
  const { editAccount, user } = props;
  const { currentPassword, newPassword, email } = values;
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
      email,
      currentPassword: password,
      newPassword,
    });
  }
};

class AccountChangeEmailModal extends Component {
  componentWillReceiveProps(nextProps) {
    const {
      editAccountState: { prevSuccess },
    } = this.props;
    const {
      editAccountState: { success, validationErrors },
      onClose,
      isSubmitting,
      setStatus,
      setSubmitting,
    } = nextProps;
    if (success && success !== prevSuccess) {
      onClose();
    } else if (validationErrors && isSubmitting) {
      setSubmitting(false);
      setStatus(validationErrors);
    }
  }

  componentWillUnmount() {
    const { editAccountClear } = this.props;
    editAccountClear();
  }

  render() {
    const {
      editAccountState: { loading },
      user,
      onClose,
      i18n,
      handleSubmit,
      setFieldValue,
      setFieldTouched,
    } = this.props;
    return (
      <ModalForm
        title={i18n.formatString(
          i18n.accountSettingsChange,
          i18n.accountSettingsEmail,
        )}
        onSubmit={handleSubmit}
        onClose={onClose}
        loading={loading}
      >
        <View>
          {(!user.isProvisionalAccount || !user.password) && (
            <Field
              name="currentPassword"
              component={PXFormInput}
              label={i18n.password}
              secureTextEntry
              onChangeText={setFieldValue}
              onBlur={setFieldTouched}
            />
          )}
          {user.isProvisionalAccount && (
            <Field
              name="newPassword"
              component={PXFormInput}
              label={i18n.accountSettingsPasswordNew}
              secureTextEntry
              onChangeText={setFieldValue}
              onBlur={setFieldTouched}
            />
          )}
          <Field
            name="email"
            component={PXFormInput}
            label={i18n.accountSettingsEmail}
            autoCapitalize="none"
            onChangeText={setFieldValue}
            onBlur={setFieldTouched}
          />
        </View>
      </ModalForm>
    );
  }
}

const AccountChangeEmailModalForm = withFormik({
  mapPropsToValues: () => ({
    currentPassword: '',
    newPassword: '',
    email: '',
  }),
  validate,
  handleSubmit: handleOnSubmit,
})(AccountChangeEmailModal);

export default connectLocalization(
  connect(
    (state) => ({
      editAccountState: state.editAccount,
    }),
    {
      ...modalActionCreators,
      ...editAccountActionCreators,
    },
  )(AccountChangeEmailModalForm),
);

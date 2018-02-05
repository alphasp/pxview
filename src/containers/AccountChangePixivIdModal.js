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

const handleOnSubmit = (values, { props }) => {
  const { editAccount, user } = props;
  const { currentPassword, newPassword, pixivId } = values;
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
      pixivId,
      currentPassword: password,
      newPassword,
    });
  }
};

class AccountChangePixivIdModal extends Component {
  componentWillReceiveProps(nextProps) {
    const { editAccountState: { prevSuccess } } = this.props;
    const {
      editAccountState: { success, validationErrors },
      onClose,
      isSubmitting,
      setErrors,
      setSubmitting,
    } = nextProps;
    if (success && success !== prevSuccess) {
      onClose();
    } else if (validationErrors && isSubmitting) {
      setSubmitting(false);
      setErrors(validationErrors);
    }
  }

  componentWillUnmount() {
    const { editAccountClear } = this.props;
    editAccountClear();
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
      setFieldValue,
      setFieldTouched,
    } = this.props;
    return (
      <ModalForm
        title={i18n.formatString(
          i18n.accountSettingsChange,
          i18n.accountSettingsPixivId,
        )}
        onSubmit={handleSubmit}
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
              onChangeText={setFieldValue}
              onBlur={setFieldTouched}
            />}
          {user.isProvisionalAccount &&
            <Field
              name="newPassword"
              component={PXFormInput}
              label={i18n.accountSettingsPasswordNew}
              secureTextEntry
              onChangeText={setFieldValue}
              onBlur={setFieldTouched}
            />}
          <Field
            name="pixivId"
            component={PXFormInput}
            label={i18n.accountSettingsPixivId}
            autoCapitalize="none"
            onChangeText={setFieldValue}
            onBlur={setFieldTouched}
          />
        </View>
      </ModalForm>
    );
  }
}

const AccountChangePixivIdModalForm = withFormik({
  mapPropsToValues: () => ({
    currentPassword: '',
    newPassword: '',
    pixivId: '',
  }),
  validate,
  handleSubmit: handleOnSubmit,
})(AccountChangePixivIdModal);

export default connectLocalization(
  connect(
    state => ({
      editAccountState: state.editAccount,
    }),
    {
      ...modalActionCreators,
      ...editAccountActionCreators,
    },
  )(AccountChangePixivIdModalForm),
);

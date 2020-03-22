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
  const { currentPassword, newPassword } = values;
  const { i18n } = props;
  const errors = {};
  if (!currentPassword) {
    errors.currentPassword = i18n.accountSettingsValidatePasswordCurrent;
  }
  if (!newPassword) {
    errors.newPassword = i18n.accountSettingsValidatePasswordNew;
  }
  return errors;
};

const handleOnSubmit = (values, { props }) => {
  const { editAccount } = props;
  const { currentPassword, newPassword } = values;
  if (currentPassword && newPassword) {
    Keyboard.dismiss();
    editAccount({ currentPassword, newPassword });
  }
};

class AccountChangePasswordModal extends Component {
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
      setSubmitting(false);
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
      onClose,
      handleSubmit,
      setFieldValue,
      setFieldTouched,
      i18n,
    } = this.props;
    return (
      <ModalForm
        title={i18n.formatString(i18n.accountSettingsChange, i18n.password)}
        onSubmit={handleSubmit}
        onClose={onClose}
        loading={loading}
      >
        <View>
          <Field
            name="currentPassword"
            component={PXFormInput}
            label={i18n.accountSettingsPasswordCurrent}
            secureTextEntry
            onChangeText={setFieldValue}
            onBlur={setFieldTouched}
          />
          <Field
            name="newPassword"
            component={PXFormInput}
            label={i18n.accountSettingsPasswordNew}
            secureTextEntry
            onChangeText={setFieldValue}
            onBlur={setFieldTouched}
          />
        </View>
      </ModalForm>
    );
  }
}

const AccountChangePasswordModalForm = withFormik({
  mapPropsToValues: () => ({
    currentPassword: '',
    newPassword: '',
  }),
  validate,
  handleSubmit: handleOnSubmit,
})(AccountChangePasswordModal);

export default connectLocalization(
  connect(
    (state) => ({
      editAccountState: state.editAccount,
    }),
    {
      ...modalActionCreators,
      ...editAccountActionCreators,
    },
  )(AccountChangePasswordModalForm),
);

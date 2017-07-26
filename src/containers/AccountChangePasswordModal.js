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

const FORM_ID = 'changePassword';

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

class AccountChangePasswordModal extends Component {
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
    const { editAccount } = this.props;
    const { currentPassword, newPassword } = data;
    if (currentPassword && newPassword) {
      Keyboard.dismiss();
      editAccount({ formId: FORM_ID, currentPassword, newPassword });
    }
  };

  render() {
    const {
      editAccountState: { loading },
      onClose,
      i18n,
      handleSubmit,
    } = this.props;
    return (
      <ModalForm
        title={i18n.formatString(i18n.accountSettingsChange, i18n.password)}
        onSubmit={handleSubmit(this.submit)}
        onClose={onClose}
        loading={loading}
      >
        <View>
          <Field
            name="currentPassword"
            component={PXFormInput}
            label={i18n.accountSettingsPasswordCurrent}
            secureTextEntry
          />
          <Field
            name="newPassword"
            component={PXFormInput}
            label={i18n.accountSettingsPasswordNew}
            secureTextEntry
          />
        </View>
      </ModalForm>
    );
  }
}

const AccountChangePasswordModalForm = reduxForm({
  form: FORM_ID,
  validate,
})(AccountChangePasswordModal);

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
  )(AccountChangePasswordModalForm),
);

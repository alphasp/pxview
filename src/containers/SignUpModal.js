import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Modal,
  Text,
  Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Button } from 'react-native-elements';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import { connectLocalization } from '../components/Localization';
import PXFormInput from '../components/PXFormInput';
import * as authActionCreators from '../common/actions/auth';
import * as modalActionCreators from '../common/actions/modal';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    margin: 15,
    paddingBottom: 20,
  },
  buttonContainer: {
    marginTop: 15,
  },
  nicknameHelp: {
    color: '#fff',
    textAlign: 'center',
  },
});

const validate = (values, props) => {
  const { nickname } = values;
  const { i18n } = props;
  const errors = {};
  if (!nickname) {
    errors.nickname = i18n.signUpValidateNickname;
  }
  return errors;
};

class SignUpModal extends Component {
  componentWillReceiveProps(nextProps) {
    const { auth: { user: prevUser }, closeModal } = this.props;
    const { auth: { user } } = nextProps;
    if (user !== prevUser) {
      closeModal();
    }
  }

  handleOnModalClose = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  submit = data => {
    const { signUp } = this.props;
    const { nickname } = data;
    if (nickname) {
      Keyboard.dismiss();
      signUp(nickname);
    }
  };

  render() {
    const { auth: { loading }, i18n, handleSubmit } = this.props;
    return (
      <Modal
        animationType="fade"
        transparent
        visible
        onRequestClose={this.handleOnModalClose}
      >
        <TouchableWithoutFeedback onPress={this.handleOnModalClose}>
          <View style={styles.container}>
            <TouchableWithoutFeedback>
              <View style={styles.innerContainer}>
                <KeyboardAvoidingView behavior="padding">
                  <View style={styles.formContainer}>
                    <Field
                      name="nickname"
                      component={PXFormInput}
                      label={i18n.signUpNickname}
                      autoCapitalize="none"
                    />
                    <Button
                      title={i18n.signUpStart}
                      containerViewStyle={styles.buttonContainer}
                      backgroundColor={globalStyleVariables.PRIMARY_COLOR}
                      raised
                      onPress={handleSubmit(this.submit)}
                    />
                  </View>
                </KeyboardAvoidingView>
                <Text style={styles.nicknameHelp}>
                  {i18n.signUpNicknameHelp}
                </Text>
                <OverlaySpinner visible={loading} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const SignUpModalForm = reduxForm({
  form: 'signUp',
  destroyOnUnmount: true,
  validate,
})(SignUpModal);

export default connectLocalization(
  connect(
    state => ({
      auth: state.auth,
    }),
    {
      ...authActionCreators,
      ...modalActionCreators,
    },
  )(SignUpModalForm),
);

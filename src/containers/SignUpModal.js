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
import { withFormik, Field } from 'formik';
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

const handleOnSubmit = (values, { props }) => {
  const { signUp } = props;
  const { nickname } = values;
  if (nickname) {
    Keyboard.dismiss();
    signUp(nickname);
  }
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

  render() {
    const {
      auth: { loading },
      i18n,
      handleSubmit,
      setFieldValue,
      setFieldTouched,
    } = this.props;
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
                      onChangeText={setFieldValue}
                      onBlur={setFieldTouched}
                    />
                    <Button
                      title={i18n.signUpStart}
                      containerViewStyle={styles.buttonContainer}
                      backgroundColor={globalStyleVariables.PRIMARY_COLOR}
                      raised
                      onPress={handleSubmit}
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

const SignUpModalForm = withFormik({
  mapPropsToValues: () => ({
    nickname: '',
  }),
  validate,
  handleSubmit: handleOnSubmit,
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

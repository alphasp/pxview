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
import { withTheme, Button } from 'react-native-paper';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import { connectLocalization } from '../components/Localization';
import PXFormInput from '../components/PXFormInput';
import * as authActionCreators from '../common/actions/auth';
import * as modalActionCreators from '../common/actions/modal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
  formContainer: {
    justifyContent: 'center',
    margin: 15,
    padding: 20,
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
      theme,
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
                  <View
                    style={[
                      styles.formContainer,
                      { backgroundColor: theme.colors.background },
                    ]}
                  >
                    <Field
                      name="nickname"
                      component={PXFormInput}
                      label={i18n.signUpNickname}
                      autoCapitalize="none"
                      mode="outlined"
                      onChangeText={setFieldValue}
                      onBlur={setFieldTouched}
                    />
                    <Button
                      style={styles.buttonContainer}
                      mode="contained"
                      onPress={handleSubmit}
                    >
                      {i18n.signUpStart}
                    </Button>
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

export default withTheme(
  connectLocalization(
    connect(
      state => ({
        auth: state.auth,
      }),
      {
        ...authActionCreators,
        ...modalActionCreators,
      },
    )(SignUpModalForm),
  ),
);

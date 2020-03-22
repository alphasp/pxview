import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Modal,
  Text,
  Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigationFocus } from '@react-navigation/compat';
import { withFormik, Field } from 'formik';
import { withTheme, Button } from 'react-native-paper';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import { connectLocalization } from '../components/Localization';
import PXFormInput from '../components/PXFormInput';
import * as authActionCreators from '../common/actions/auth';
import * as modalActionCreators from '../common/actions/modal';
import { SCREENS } from '../common/constants';

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
  privacyPolicy: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 15,
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
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      auth: { user },
      isFocused,
    } = nextProps;
    const {
      auth: { user: prevUser },
      closeModal,
      isFocused: prevIsFocused,
    } = this.props;
    if (user !== prevUser) {
      closeModal();
    }
    if (isFocused && isFocused !== prevIsFocused) {
      this.setState({
        isShowModal: true,
      });
    }
  }

  handleOnModalClose = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  handleOnPressPrivacyPolicy = () => {
    const { navigate } = this.props.navigation;
    this.setState({
      isShowModal: false,
    });
    navigate(SCREENS.PrivacyPolicy);
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
    const { isShowModal } = this.state;
    return (
      <Modal
        animationType="fade"
        transparent
        visible={isShowModal}
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
                <TouchableOpacity onPress={this.handleOnPressPrivacyPolicy}>
                  <Text style={styles.privacyPolicy}>{i18n.privacyPolicy}</Text>
                </TouchableOpacity>
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

export default withNavigationFocus(
  withTheme(
    connectLocalization(
      connect(
        (state) => ({
          auth: state.auth,
        }),
        {
          ...authActionCreators,
          ...modalActionCreators,
        },
      )(SignUpModalForm),
    ),
  ),
);

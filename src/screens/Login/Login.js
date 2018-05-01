import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  View,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import { withFormik, Field } from 'formik';
import { Button } from 'react-native-elements';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import { connectLocalization } from '../../components/Localization';
import PXFormInput from '../../components/PXFormInput';
import WalkthroughIllustList from '../../containers/WalkthroughIllustList';
import * as authActionCreators from '../../common/actions/auth';
import * as modalActionCreators from '../../common/actions/modal';
import { MODAL_TYPES } from '../../common/constants';
import { globalStyleVariables } from '../../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    paddingHorizontal: 5,
    paddingTop: 30,
    backgroundColor: 'rgba(0,0,0,0.4)',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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
  outlineButtonContainer: {
    borderColor: globalStyleVariables.PRIMARY_COLOR,
    borderWidth: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
});

const validate = (values, props) => {
  const { email, password } = values;
  const { i18n } = props;
  const errors = {};
  if (!email) {
    errors.email = i18n.loginValidateEmailOrPixivId;
  }
  if (!password) {
    errors.password = i18n.loginValidatePassword;
  }
  return errors;
};

const handleOnSubmit = (values, { props }) => {
  const { login } = props;
  const { email, password } = values;
  if (email && password) {
    Keyboard.dismiss();
    login(email, password);
  }
};

class Login extends Component {
  handleOnPressSignUp = () => {
    const { openModal } = this.props;
    openModal(MODAL_TYPES.SIGNUP);
  };

  render() {
    const {
      auth: { loading },
      modal,
      i18n,
      handleSubmit,
      setFieldValue,
      setFieldTouched,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <WalkthroughIllustList />
        </View>
        {modal.modalType !== MODAL_TYPES.SIGNUP &&
          <View
            style={[
              styles.innerContainer,
              modal.modalType === MODAL_TYPES.SIGNUP && {},
            ]}
          >
            <KeyboardAvoidingView behavior="padding">
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../images/logo.png')} // eslint-disable-line global-require
                  style={styles.logo}
                />
              </View>
              <View style={styles.formContainer}>
                <Field
                  name="email"
                  component={PXFormInput}
                  label={i18n.loginEmailOrPixivId}
                  autoCapitalize="none"
                  onChangeText={setFieldValue}
                  onBlur={setFieldTouched}
                />
                <Field
                  name="password"
                  component={PXFormInput}
                  label={i18n.password}
                  secureTextEntry
                  onChangeText={setFieldValue}
                  onBlur={setFieldTouched}
                />
                <Button
                  title={i18n.login}
                  containerViewStyle={styles.buttonContainer}
                  backgroundColor={globalStyleVariables.PRIMARY_COLOR}
                  raised
                  onPress={handleSubmit}
                />
                <Button
                  title={i18n.loginNoAccount}
                  containerViewStyle={[
                    styles.buttonContainer,
                    styles.outlineButtonContainer,
                  ]}
                  backgroundColor="transparent"
                  color={globalStyleVariables.PRIMARY_COLOR}
                  onPress={this.handleOnPressSignUp}
                />
              </View>
            </KeyboardAvoidingView>
            <OverlaySpinner visible={loading} />
          </View>}
      </View>
    );
  }
}

const LoginForm = withFormik({
  mapPropsToValues: () => ({
    email: '',
    password: '',
  }),
  validate,
  handleSubmit: handleOnSubmit,
})(Login);

export default connectLocalization(
  connect(
    (state, props) => ({
      auth: state.auth,
      modal: state.modal,
      onLoginSuccess:
        props.onLoginSuccess ||
        (props.navigation.state &&
          props.navigation.state.params &&
          props.navigation.state.params.onLoginSuccess),
    }),
    {
      ...authActionCreators,
      ...modalActionCreators,
    },
  )(LoginForm),
);

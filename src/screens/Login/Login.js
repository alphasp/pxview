import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { withFormik, Field } from 'formik';
import { withTheme, Button, Text } from 'react-native-paper';
import Contentsquare, { Currency } from '@contentsquare/react-native-sdk';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import { connectLocalization } from '../../components/Localization';
import PXFormInput from '../../components/PXFormInput';
import WalkthroughIllustList from '../../containers/WalkthroughIllustList';
import * as authActionCreators from '../../common/actions/auth';
import * as modalActionCreators from '../../common/actions/modal';
import { MODAL_TYPES, SCREENS } from '../../common/constants';
import { globalStyleVariables } from '../../styles';
import { WebView } from 'react-native-webview';

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
    justifyContent: 'center',
    margin: 15,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 15,
  },
  outlineButtonContainer: {
    borderColor: globalStyleVariables.PRIMARY_COLOR,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
  privacyPolicy: {
    textAlign: 'center',
    marginTop: 15,
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
  
  constructor(props) {
    super(props);

    this.webview = null;
    this.setWebviewRef = element => {
      this.webview = element;
    };
  }

  handleOnPressSignUp = () => {
    Contentsquare.sendTransaction(23.45, Currency.USD);
    const {
      navigation: { navigate },
    } = this.props;
    navigate(SCREENS.SignUp);
  };

  handleOnPressPrivacyPolicy = () => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate(SCREENS.PrivacyPolicy);
  };

  componentDidMount() {
    const currentRoute = this.props.navigation.state.routeName;
    this.props.navigation.addListener('didFocus', (event) => {

      if (currentRoute === event.state.routeName) {
        Contentsquare.send('Login');
      }
      Contentsquare.registerWebView(this.webview);
    });

    this.props.navigation.addListener('didBlur', (event) => {
      Contentsquare.unregisterWebView(this.webview);
    });
  }

  render() {
    const {
      auth: { loading },
      modal,
      i18n,
      handleSubmit,
      setFieldValue,
      setFieldTouched,
      theme,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <WalkthroughIllustList />
        </View>
        {modal.modalType !== MODAL_TYPES.SIGNUP && (
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
              <View
                style={[
                  styles.formContainer,
                  { backgroundColor: theme.colors.background },
                ]}
              >
                <Field
                  name="email"
                  component={PXFormInput}
                  label={i18n.loginEmailOrPixivId}
                  mode="outlined"
                  autoCapitalize="none"
                  onChangeText={setFieldValue}
                  onBlur={setFieldTouched}
                />
                <Field
                  name="password"
                  component={PXFormInput}
                  label={i18n.password}
                  mode="outlined"
                  secureTextEntry
                  onChangeText={setFieldValue}
                  onBlur={setFieldTouched}
                />
                <Button
                  style={styles.buttonContainer}
                  mode="contained"
                  onPress={handleSubmit}
                >
                  {i18n.login}
                </Button>
                <Button
                  style={[
                    styles.buttonContainer,
                    styles.outlineButtonContainer,
                  ]}
                  mode="outlined"
                  onPress={this.handleOnPressSignUp}
                >
                  {i18n.loginNoAccount}
                </Button>
                <TouchableOpacity onPress={this.handleOnPressPrivacyPolicy}>
                  <Text style={styles.privacyPolicy}>{i18n.privacyPolicy}</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
            <WebView
              source={{ uri: 'https://tupeuxpastest.csq.io/mobile/web-view.html' }}
              useWebKit={true}
              ref={this.setWebviewRef}
            />
            <OverlaySpinner visible={loading} />
          </View>
        )}
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

export default withTheme(
  connectLocalization(
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
  ),
);

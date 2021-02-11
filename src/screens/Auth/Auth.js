import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { withTheme, Button, Text } from 'react-native-paper';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import { connectLocalization } from '../../components/Localization';
import WalkthroughIllustList from '../../containers/WalkthroughIllustList';
import * as modalActionCreators from '../../common/actions/modal';
import { MODAL_TYPES, SCREENS } from '../../common/constants';
import PKCE from '../../common/helpers/pkce';
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

class Login extends Component {
  handleOnPressLogin = async () => {
    const {
      navigation: { navigate },
    } = this.props;
    const { codeChallenge } = await PKCE.generatePKCE();
    navigate(SCREENS.Login, {
      url: `https://app-api.pixiv.net/web/v1/login?code_challenge=${codeChallenge}&code_challenge_method=S256&client=pixiv-android`,
    });
  };

  handleOnPressSignUp = () => {
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

  render() {
    const {
      auth: { loading },
      modal,
      i18n,
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
                <Button
                  style={styles.buttonContainer}
                  mode="contained"
                  onPress={this.handleOnPressLogin}
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
            <OverlaySpinner visible={loading} />
          </View>
        )}
      </View>
    );
  }
}

export default withTheme(
  connectLocalization(
    connect(
      (state, props) => ({
        auth: state.auth,
        modal: state.modal,
        onLoginSuccess:
          props.onLoginSuccess ||
          (props.route &&
            props.route.params &&
            props.route.params.onLoginSuccess),
      }),
      {
        ...modalActionCreators,
      },
    )(Login),
  ),
);

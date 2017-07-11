import React, { Component } from 'react';
import { Image, StyleSheet, View, Linking, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Button } from 'react-native-elements';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import { connectLocalization } from '../../components/Localization';
import PXFormInput from '../../components/PXFormInput';
import * as authActionCreators from '../../common/actions/auth';
import { globalStyleVariables } from '../../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    paddingTop: 30,
    backgroundColor: globalStyleVariables.PRIMARY_COLOR,
  },
  buttonContainer: {
    marginTop: 15,
  },
  outlineButtonContainer: {
    borderColor: '#fff',
    borderWidth: 1,
  },
  formLabel: {
    color: '#fff',
  },
  formInput: {
    color: '#fff',
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

class Login extends Component {
  // componentWillReceiveProps(nextProps) {
  //   const { auth: { user: prevUser } } = this.props;
  //   const {
  //     auth: { user },
  //     navigation: { goBack },
  //     onLoginSuccess,
  //   } = nextProps;
  //   if (user !== prevUser) {
  //     goBack();
  //     if (onLoginSuccess) {
  //       setTimeout(() => onLoginSuccess(user), 0);
  //     }
  //   }
  // }

  submit = data => {
    const { login } = this.props;
    const { email, password } = data;
    if (email && password) {
      Keyboard.dismiss();
      login(email, password);
    }
  };

  handleOnPressSignUp = () => {
    const url = 'https://accounts.pixiv.net/signup';
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          return null;
        }
        return Linking.openURL(url);
      })
      .catch(err => err);
  };

  render() {
    const { auth: { loading }, i18n, handleSubmit } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../images/logo_transparent.png')} // eslint-disable-line global-require
            style={styles.logo}
          />
        </View>
        <Field
          name="email"
          component={PXFormInput}
          label={i18n.loginEmailOrPixivId}
          autoCapitalize="none"
          labelStyle={styles.formLabel}
          inputStyle={styles.formInput}
        />
        <Field
          name="password"
          component={PXFormInput}
          label={i18n.password}
          secureTextEntry
          labelStyle={styles.formLabel}
          inputStyle={styles.formInput}
        />
        <Button
          title={i18n.login}
          containerViewStyle={styles.buttonContainer}
          backgroundColor="#fff"
          color={globalStyleVariables.PRIMARY_COLOR}
          raised
          onPress={handleSubmit(this.submit)}
        />
        <Button
          title={i18n.signup}
          containerViewStyle={[
            styles.buttonContainer,
            styles.outlineButtonContainer,
          ]}
          backgroundColor="transparent"
          onPress={this.handleOnPressSignUp}
        />
        <OverlaySpinner visible={loading} />
      </View>
    );
  }
}

const LoginForm = reduxForm({
  form: 'login',
  // destroyOnUnmount: false,
  validate,
})(Login);

export default connectLocalization(
  connect(
    (state, props) => ({
      auth: state.auth,
      onLoginSuccess:
        props.onLoginSuccess ||
        (props.navigation.state &&
          props.navigation.state.params &&
          props.navigation.state.params.onLoginSuccess),
    }),
    authActionCreators,
  )(LoginForm),
);

import React, { Component } from 'react';
import { StyleSheet, View, Linking, Keyboard } from 'react-native';
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
    padding: 5,
  },
  buttonContainer: {
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

class Login extends Component {
  componentWillReceiveProps(nextProps) {
    const { auth: { user: prevUser } } = this.props;
    const {
      auth: { user },
      navigation: { goBack },
      onLoginSuccess,
    } = nextProps;
    if (user !== prevUser) {
      goBack();
      if (onLoginSuccess) {
        setTimeout(() => onLoginSuccess(user), 0);
      }
    }
  }

  submit = data => {
    const { login } = this.props;
    const { email, password } = data;
    Keyboard.dismiss();
    login(email, password);
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
        <Field
          name="email"
          component={PXFormInput}
          label={i18n.loginEmailOrPixivId}
          autoCapitalize="none"
        />
        <Field
          name="password"
          component={PXFormInput}
          label={i18n.password}
          secureTextEntry
        />
        <Button
          title={i18n.login}
          containerViewStyle={styles.buttonContainer}
          backgroundColor={globalStyleVariables.PRIMARY_COLOR}
          raised
          onPress={handleSubmit(this.submit)}
        />
        <Button
          title={i18n.signup}
          containerViewStyle={styles.buttonContainer}
          backgroundColor="#8BC052"
          raised
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

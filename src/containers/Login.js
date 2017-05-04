import React, { Component } from 'react';
import { StyleSheet, View, Linking, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Button } from 'react-native-elements';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import PXFormInput from '../components/PXFormInput';
import * as authActionCreators from '../common/actions/auth';

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  loginButton: {
    marginTop: 15,
    backgroundColor: '#5cafec',
  },
  signupButton: {
    marginTop: 15,
    backgroundColor: '#8BC052',
  },
});

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Email address/Pixiv ID is required';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  }
  return errors;
};

class Login extends Component {
  componentWillReceiveProps(nextProps) {
    const { authUser: prevUser } = this.props;
    const { authUser, navigation: { goBack }, onLoginSuccess } = nextProps;
    if (authUser !== prevUser) {
      goBack();
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }
  }

  submit = data => {
    const { login } = this.props;
    const { email, password } = data;
    Keyboard.dismiss();
    login(email, password);
    // todo handle login error
  };

  handleOnPressSignUp = () => {
    const url = 'https://accounts.pixiv.net/signup';
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log(`Can't handle url: ${url}`);
          return null;
        }
        return Linking.openURL(url);
      })
      .catch(err => console.error('An error occurred', err));
  };

  render() {
    const { auth: { loading }, handleSubmit } = this.props;
    return (
      <View style={styles.container}>
        <Field
          name="email"
          component={PXFormInput}
          label="Email address/Pixiv ID"
          autoCapitalize="none"
        />
        <Field
          name="password"
          component={PXFormInput}
          label="Password"
          secureTextEntry
        />
        <Button
          title="Login"
          buttonStyle={styles.loginButton}
          raised
          onPress={handleSubmit(this.submit)}
        />
        <Button
          title="Don't have an account?"
          buttonStyle={styles.signupButton}
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

export default connect(
  (state, props) => ({
    authUser: state.auth.user,
    onLoginSuccess: props.onLoginSuccess ||
      (props.navigation.state &&
        props.navigation.state.params &&
        props.navigation.state.params.onLoginSuccess),
  }),
  authActionCreators,
)(LoginForm);

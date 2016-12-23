import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Linking,
} from 'react-native';
import dismissKeyboard from 'dismissKeyboard';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FormLabel, FormInput, Button } from 'react-native-elements'
import PXFormInput from '../components/PXFormInput';
// import UVButton from '../components/UVButton';
// import FacebookLoginButton from '../components/FacebookLoginButton';
// import FloatingTextField from '../components/FloatingTextField';

// import { login, facebookLogin } from "../../common/actions/auth.native";
// import { addError } from '../../common/actions/error';
// import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import OverlaySpinner from 'react-native-loading-spinner-overlay';

const styles = StyleSheet.create({
  container: {
    padding: 5
  },
  loginButton: {
    marginTop: 15,
    backgroundColor: '#5cafec',
  },
  signupButton: {
    marginTop: 15,
    backgroundColor: '#8BC052',
  }
})

const validate = (values, props) => {
  const errors = {};
  console.log('validate ', values)
  if (!values.email) {
    errors.email = "Email address/Pixiv ID is required";
  }
  if (!values.password) {
    errors.password = "Password is required";
  }
  return errors;
};

class Login extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: false
    };
  }
  
  submit = (values) => {
    dismissKeyboard();
    console.log('submit ', values);
    const { email, password } = values;
    this.setState({
      loading: true
    });
    setTimeout(() => {
      this.setState({
        loading: false
      });
    }, 2000);
    // dispatch(login(email, password)).then(() => {
    //   this.setState({
    //     loading: false
    //   });
    //   // const { error } = this.props;
    //   // if (error){
    //   //   console.log("error ", error)
    //   //   MessageBarManager.showAlert({
    //   //     message: error,
    //   //     titleNumberOfLines: 0,
    //   //     alertType: 'error',
    //   //   });
    //   // }
    // });
  }

  handleOnPressSignUp = () => {
    const url = 'https://accounts.pixiv.net/signup';
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } 
      else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
  }


  handleFacebookLogin = (err, response) => {
    const { dispatch } = this.props;
    let promise = null;
    if (err || !response.accessToken){
      console.log("err ", err)
      promise = dispatch(addError("Failed to login with your facebook account, please try again. ", err));
    }
    else if (response.accessToken){
      //console.log("token ", response.accessToken);
      promise = dispatch(facebookLogin(response.accessToken));
    }
    this.setState({
      loading: true
    });
    promise.then(() => {
      this.setState({
        loading: false
      });
      // const { error } = this.props;
      // if (error){
      //   MessageBarManager.showAlert({
      //     message: error,
      //     titleNumberOfLines: 0,
      //     alertType: 'error',
      //   });
      // }
      // ga.event({ 
      //   category: 'User',
      //   action: 'Logged in with Facebook'
      // });
    });
  };

  render() {
    const { handleSubmit, error } = this.props;
    const { loading } = this.state;
    return (
      <View style={ styles.container }>
        <Field name="email" component={PXFormInput} label="Email address/Pixiv ID" />
        <Field name="password" component={PXFormInput} label="Password" secureTextEntry={true} />
        <Button 
          title='Login' 
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
        <OverlaySpinner visible={ loading } />
      </View>
    );
  }
}

const LoginForm = reduxForm({
  form: "login",
  //destroyOnUnmount: false,
  validate
})(Login);

export default connect()(LoginForm);
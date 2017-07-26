import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  View,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
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
    const { openModal } = this.props;
    openModal(MODAL_TYPES.SIGNUP);
  };

  render() {
    const { auth: { loading }, modal, i18n, handleSubmit } = this.props;
    return (
      <View style={styles.container}>
        <View
          ref={ref => (this.list = ref)}
          style={{ flex: 1 }}
          onLayout={this.handleOnLayout}
        >
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

const LoginForm = reduxForm({
  form: 'login',
  // destroyOnUnmount: false,
  validate,
})(Login);

// export default connectLocalization(
//   connect(
//     () => {
//       const getRankingItems = makeGetRankingItems();
//       return (state, props) => {
//         const { ranking } = state;
//         const rankingItems = getRankingItems(state, {
//           ...props,
//           rankingMode: RANKING_FOR_UI.DAILY,
//         });
//         const backgroundImage =
//           rankingItems && rankingItems.length
//             ? rankingItems[0].image_urls.medium
//             : '';
//         return {
//           auth: state.auth,
//           backgroundImage,
//           loaded: ranking[RANKING_FOR_UI.DAILY].loaded,
//           onLoginSuccess:
//             props.onLoginSuccess ||
//             (props.navigation.state &&
//               props.navigation.state.params &&
//               props.navigation.state.params.onLoginSuccess),
//         };
//       };
//     },
//     { ...authActionCreators, ...rankingActionCreators },
//   )(LoginForm),
// );

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

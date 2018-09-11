import React, { Component } from 'react';
import { View, StyleSheet, DeviceEventEmitter, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import {
  DefaultTheme,
  DarkTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import Toast, { DURATION } from 'react-native-easy-toast';
import createAppNavigator from '../../navigations/AppNavigator';
import LoginNavigator from '../../navigations/LoginNavigator';
import { connectLocalization } from '../../components/Localization';
import Loader from '../../components/Loader';
import ModalRoot from '../../containers/ModalRoot';
import * as routeActionCreators from '../../common/actions/route';
import { THEME_TYPES } from '../../common/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    const { initialRouteName } = props;
    this.appNavigator = createAppNavigator({
      initialRouteName,
    });
  }

  componentDidMount() {
    MessageBarManager.registerMessageBar(this.messageBarAlert);
    this.showToastListener = DeviceEventEmitter.addListener(
      'showToast',
      text => {
        this.toast.show(text, DURATION.LENGTH_LONG);
      },
    );
    const { rehydrated } = this.props;
    if (rehydrated) {
      // call when reopen app after exit by back button on android
      SplashScreen.hide();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { rehydrated: prevRehydrated } = this.props;
    const { rehydrated } = nextProps;
    if (!prevRehydrated && rehydrated) {
      SplashScreen.hide();
    }
  }

  componentWillUnmount() {
    MessageBarManager.unregisterMessageBar();
    this.showToastListener.remove();
  }

  render() {
    const { rehydrated, user, i18n, themeName } = this.props;
    let renderComponent;
    if (!rehydrated) {
      renderComponent = <Loader />;
    } else if (user) {
      const Navigator = this.appNavigator;
      renderComponent = (
        <Navigator
          screenProps={{ i18n }}
          uriPrefix={/^(?:https?:\/\/)?(?:www|touch)\.pixiv\.net\/|^pixiv:\/\//}
        />
      );
    } else {
      renderComponent = <LoginNavigator screenProps={{ i18n }} />;
    }
    const theme = themeName === THEME_TYPES.DARK ? DarkTheme : DefaultTheme;
    return (
      <PaperProvider theme={theme}>
        <View style={styles.container}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="rgba(0, 0, 0, 0.3)"
            translucent
            animated
          />
          {renderComponent}
          <MessageBar ref={ref => (this.messageBarAlert = ref)} />
          <Toast ref={ref => (this.toast = ref)} opacity={0.7} />
          <ModalRoot />
        </View>
      </PaperProvider>
    );
  }
}

export default connectLocalization(
  connect(
    state => ({
      error: state.error,
      rehydrated: state.auth.rehydrated,
      user: state.auth.user,
      initialRouteName: state.initialScreenSettings.routeName,
      themeName: state.theme.name,
    }),
    routeActionCreators,
  )(App),
);

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, DeviceEventEmitter, StatusBar } from 'react-native';
import { connect, useSelector } from 'react-redux';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {
  DefaultTheme as PaperDefaulTheme,
  DarkTheme as PaperDarkTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import Toast, { DURATION } from 'react-native-easy-toast';
import AppNavigator from '../../navigations/AppNavigator';
import LoginNavigator from '../../navigations/LoginNavigator';
import { useLocalization } from '../../components/Localization';
import Loader from '../../components/Loader';
import ModalRoot from '../../containers/ModalRoot';
import { THEME_TYPES } from '../../common/constants';
import { globalStyleVariables } from '../../styles';
import usePrevious from '../../common/hooks/usePrevious';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const App = () => {
  // const error = useSelector((state) => state.error);
  const rehydrated = useSelector((state) => state.auth.rehydrated);
  const user = useSelector((state) => state.auth.user);
  const initialRouteName = useSelector(
    (state) => state.initialScreenSettings.routeName,
  );
  const themeName = useSelector((state) => state.theme.name);

  const messageBarAlertRef = useRef(null);
  const toastRef = useRef(null);
  const prevRehydrated = usePrevious(rehydrated);
  const i18n = useLocalization();

  useEffect(() => {
    MessageBarManager.registerMessageBar(messageBarAlertRef.current);
    return () => {
      MessageBarManager.unregisterMessageBar();
    };
  }, []);
  useEffect(() => {
    const showToastListener = DeviceEventEmitter.addListener(
      'showToast',
      (text) => {
        toastRef.current.show(text, DURATION.LENGTH_LONG);
      },
    );
    return () => {
      showToastListener.remove();
    };
  }, []);

  useEffect(() => {
    if (!prevRehydrated && rehydrated) {
      SplashScreen.hide();
    }
  }, [prevRehydrated, rehydrated]);

  let renderComponent;
  let theme;
  const extraColorsConfig = {
    primary: globalStyleVariables.PRIMARY_COLOR,
    activeTint:
      themeName === THEME_TYPES.DARK
        ? '#000000'
        : globalStyleVariables.PRIMARY_COLOR,
    headerBackground:
      themeName === THEME_TYPES.DARK
        ? '#1a1a1a'
        : globalStyleVariables.PRIMARY_COLOR,
    modalTitleBackground:
      themeName === THEME_TYPES.DARK ? '#1a1a1a' : '#E9EBEE',
  };
  if (themeName === THEME_TYPES.DARK) {
    theme = {
      ...PaperDarkTheme,
      ...NavigationDarkTheme,
      colors: {
        ...PaperDarkTheme.colors,
        ...NavigationDarkTheme.colors,
        ...extraColorsConfig,
      },
    };
  } else {
    theme = {
      ...PaperDefaulTheme,
      ...NavigationDefaultTheme,
      colors: {
        ...PaperDefaulTheme.colors,
        ...NavigationDefaultTheme.colors,
        ...extraColorsConfig,
      },
    };
  }
  if (!rehydrated) {
    renderComponent = <Loader />;
  } else if (user) {
    renderComponent = (
      <AppNavigator
        // screenProps={{ i18n, theme }}
        initialRouteName={initialRouteName}
        uriPrefix={/^(?:https?:\/\/)?(?:www|touch)\.pixiv\.net\/|^pixiv:\/\//}
      />
    );
  } else {
    renderComponent = <LoginNavigator screenProps={{ i18n, theme }} />;
  }
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <View style={styles.container}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="rgba(0, 0, 0, 0.3)"
            translucent
            animated
          />
          {renderComponent}
          <MessageBar ref={messageBarAlertRef} />
          <Toast ref={toastRef} opacity={0.7} />
          <ModalRoot />
        </View>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;

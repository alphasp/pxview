import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, DeviceEventEmitter, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
  useLinking,
} from '@react-navigation/native';
import { getStateFromPath } from '@react-navigation/core';
import analytics from '@react-native-firebase/analytics';
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
import { THEME_TYPES, SCREENS } from '../../common/constants';
import { globalStyleVariables } from '../../styles';
import usePrevious from '../../common/hooks/usePrevious';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const getActiveRouteName = (state) => {
  const route = state.routes[state.index];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
};

const App = () => {
  const [initialState, setInitialState] = React.useState();
  const [navigationIsReady, setNavigationIsReady] = React.useState(false);
  const rehydrated = useSelector((state) => state.auth.rehydrated);
  const user = useSelector((state) => state.auth.user);
  const initialRouteName = useSelector(
    (state) => state.initialScreenSettings.routeName,
  );
  const themeName = useSelector((state) => state.theme.name);

  const messageBarAlertRef = useRef();
  const toastRef = useRef();
  const navigationRef = useRef();
  const routeNameRef = useRef();
  const prevRehydrated = usePrevious(rehydrated);
  const i18n = useLocalization();
  const { getInitialState } = useLinking(navigationRef, {
    prefixes: [
      'https://www.pixiv.net/en',
      'https://www.pixiv.net',
      'http://www.pixiv.net',
      'http://www.pixiv.net/en',
      'https://touch.pixiv.net',
      'pixiv://',
    ],
    config: {
      [SCREENS.Detail]: 'artworks/:illustId',
      [SCREENS.NovelDetail]: 'novel/show.php',
      [SCREENS.UserDetail]: 'users/:uid',
      // workaround to handle deep link to one screen with multiple path
      [`${SCREENS.Detail}-1`]: 'illusts/:illustId',
      [`${SCREENS.Detail}-2`]: 'member_illust.php',
      [`${SCREENS.NovelDetail}-1`]: 'novels/:novelId',
      [`${SCREENS.UserDetail}-1`]: 'member.php',
    },
    getStateFromPath: (path, options) => {
      const state = getStateFromPath(path, options);
      const newRoutes = [...state.routes];
      // eslint-disable-next-line prefer-destructuring
      newRoutes[0].name = newRoutes[0].name.split('-')[0];
      return {
        ...state,
        routes: [
          {
            name: SCREENS.Main, // Load drawer navigation first
          },
          ...newRoutes,
        ],
      };
    },
  });

  React.useEffect(() => {
    Promise.race([
      getInitialState(),
      new Promise((resolve) =>
        // Timeout in 150ms if `getInitialState` doesn't resolve
        // Workaround for https://github.com/facebook/react-native/issues/25675
        setTimeout(resolve, 150),
      ),
    ])
      .catch((e) => {
        console.error('Error getting initial state ', e);
      })
      .then((state) => {
        if (state !== undefined) {
          setInitialState(state);
        }

        setNavigationIsReady(true);
      });
  }, [getInitialState]);

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
    if (rehydrated && navigationIsReady) {
      const state = navigationRef.current.getRootState();
      // Save the initial route name
      routeNameRef.current = getActiveRouteName(state);
    }
  }, [rehydrated, navigationIsReady]);

  useEffect(() => {
    if (!prevRehydrated && rehydrated) {
      SplashScreen.hide();
    }
  }, [prevRehydrated, rehydrated]);

  const handleOnNavigationStateChange = (state) => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = getActiveRouteName(state);
    if (previousRouteName !== currentRouteName) {
      analytics().setCurrentScreen(currentRouteName, currentRouteName);
    }
    routeNameRef.current = currentRouteName;
  };

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
  if (!rehydrated || !navigationIsReady) {
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
      {(!rehydrated || !navigationIsReady) && <Loader />}
      {rehydrated && navigationIsReady && (
        <NavigationContainer
          ref={navigationRef}
          initialState={initialState}
          onStateChange={handleOnNavigationStateChange}
        >
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
      )}
    </PaperProvider>
  );
};

export default App;

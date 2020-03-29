import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { useTheme } from 'react-native-paper';
import Login from '../screens/Login/Login';
import PrivacyPolicy from '../screens/MyPage/PrivacyPolicy';
import { useLocalization } from '../components/Localization';
import {
  globalStyles,
  globalStyleVariables,
  getThemedHeaderStyle,
} from '../styles';
import { SCREENS } from '../common/constants';

const Stack = createNativeStackNavigator();

const LoginNavigator = () => {
  const theme = useTheme();
  const { i18n } = useLocalization();
  const headerStyle = getThemedHeaderStyle(theme);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: globalStyleVariables.HEADER_BACKGROUND_COLOR,
        },
        headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
        headerBackTitle: null,
      }}
    >
      <Stack.Screen
        name={SCREENS.Login}
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={SCREENS.PrivacyPolicy}
        component={PrivacyPolicy}
        options={{
          title: i18n.privacyPolicy,
          headerStyle,
        }}
      />
    </Stack.Navigator>
  );
};
export default LoginNavigator;

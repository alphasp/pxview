import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import Auth from '../screens/Auth/Auth';
import Login from '../screens/Auth/Login';
import SignUp from '../screens/Auth/SignUp';
import PrivacyPolicy from '../screens/MyPage/PrivacyPolicy';
import { useLocalization } from '../components/Localization';
import { globalStyleVariables, getThemedHeaderStyle } from '../styles';
import { SCREENS } from '../common/constants';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const theme = useTheme();
  const { i18n } = useLocalization();
  const headerStyle = getThemedHeaderStyle(theme);
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.headerBackground }}
    >
      <View style={{ flex: 1, backgroundColor: '#000' }}>
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
            name={SCREENS.Auth}
            component={Auth}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name={SCREENS.Login}
            component={Login}
            options={{
              title: i18n.login,
              headerStyle,
            }}
          />
          <Stack.Screen
            name={SCREENS.SignUp}
            component={SignUp}
            options={{
              title: i18n.signUp,
              headerStyle,
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
      </View>
    </SafeAreaView>
  );
};

export default AuthNavigator;

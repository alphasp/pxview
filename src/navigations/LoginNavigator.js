import { createStackNavigator } from '@react-navigation/stack';
import { createCompatNavigatorFactory } from '@react-navigation/compat';
import { useTheme } from 'react-native-paper';
import Login from '../screens/Login/Login';
import SignUp from '../screens/Login/SignUp';
import PrivacyPolicy from '../screens/MyPage/PrivacyPolicy';
import {
  globalStyles,
  globalStyleVariables,
  getThemedHeaderStyle,
} from '../styles';
import { SCREENS } from '../common/constants';

const LoginNavigator = createCompatNavigatorFactory(createStackNavigator)(
  {
    [SCREENS.Login]: {
      screen: Login,
      options: {
        header: () => null,
      },
    },
    [SCREENS.SignUp]: {
      screen: SignUp,
      options: ({ screenProps: { i18n, theme } }) => ({
        title: i18n.signUp,
        headerStyle: getThemedHeaderStyle(theme),
      }),
    },
    [SCREENS.PrivacyPolicy]: {
      screen: PrivacyPolicy,
      options: ({ screenProps: { i18n, theme } }) => ({
        title: i18n.privacyPolicy,
        headerStyle: getThemedHeaderStyle(theme),
      }),
    },
  },
  {
    headerMode: 'screen',
    screenOptions: {
      headerStyle: {
        backgroundColor: globalStyleVariables.HEADER_BACKGROUND_COLOR,
      },
      headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
      headerBackTitle: null,
    },
    cardStyle: globalStyles.card,
  },
);

// const LoginNavigator = () => {
//   const theme = useTheme();
// }
export default LoginNavigator;

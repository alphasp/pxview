import { createAppContainer, createStackNavigator } from 'react-navigation';
import Login from '../screens/Login/Login';
import SignUp from '../screens/Login/SignUp';
import PrivacyPolicy from '../screens/MyPage/PrivacyPolicy';
import {
  globalStyles,
  globalStyleVariables,
  getThemedHeaderStyle,
} from '../styles';
import { SCREENS } from '../common/constants';

const LoginNavigator = createStackNavigator(
  {
    [SCREENS.Login]: {
      screen: Login,
      navigationOptions: {
        header: null,
      },
    },
    [SCREENS.SignUp]: {
      screen: SignUp,
      navigationOptions: ({ screenProps: { i18n, theme } }) => ({
        title: i18n.signUp,
        headerStyle: getThemedHeaderStyle(theme),
      }),
    },
    [SCREENS.PrivacyPolicy]: {
      screen: PrivacyPolicy,
      navigationOptions: ({ screenProps: { i18n, theme } }) => ({
        title: i18n.privacyPolicy,
        headerStyle: getThemedHeaderStyle(theme),
      }),
    },
  },
  {
    headerMode: 'screen',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: globalStyleVariables.HEADER_BACKGROUND_COLOR,
      },
      headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
      headerBackTitle: null,
    },
    cardStyle: globalStyles.card,
  },
);

export default createAppContainer(LoginNavigator);

import { StackNavigator } from 'react-navigation';
import Login from '../screens/Login/Login';
import { globalStyles, globalStyleVariables } from '../styles';
import { SCREENS } from '../common/constants';

const LoginNavigator = StackNavigator(
  {
    [SCREENS.Login]: {
      screen: Login,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    headerMode: 'screen',
    navigationOptions: {
      headerStyle: {
        backgroundColor: globalStyleVariables.HEADER_BACKGROUND_COLOR,
      },
      headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
      headerBackTitle: null,
    },
    cardStyle: globalStyles.card,
  },
);

export default LoginNavigator;

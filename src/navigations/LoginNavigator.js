import { StackNavigator } from 'react-navigation';
import Login from '../screens/Login/Login';
import { globalStyles, globalStyleVariables } from '../styles';

const LoginNavigator = StackNavigator(
  {
    Login: {
      screen: Login,
    },
  },
  {
    headerMode: 'screen',
    navigationOptions: {
      headerStyle: {
        backgroundColor: globalStyleVariables.HEADER_BACKGROUND_COLOR,
      },
      headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
    },
    cardStyle: globalStyles.card,
  },
);

export default LoginNavigator;

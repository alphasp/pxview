import { StackNavigator } from 'react-navigation';
import Login from '../screens/Login/Login';

const LoginNavigator = StackNavigator(
  {
    Login: {
      screen: Login,
      path: '/',
      navigationOptions: {
        title: 'Login',
      },
    },
  },
  {
    headerMode: 'screen',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerBackTitle: null,
    },
    cardStyle: {
      backgroundColor: '#fff',
    },
  },
);

export default LoginNavigator;

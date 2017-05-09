import { StackNavigator } from 'react-navigation';
import MainNavigator from './MainNavigator';
import Login from '../screens/Login/Login';
import SearchFilterModal from '../components/SearchFilterModal';
import ImagesViewer from '../screens/ImagesViewer/ImagesViewer';

const AppNavigator = StackNavigator(
  {
    Main: {
      screen: MainNavigator,
      path: '/',
      navigationOptions: {
        header: null,
      },
    },
    Login: {
      screen: Login,
      path: '/login',
      navigationOptions: {
        title: 'Login',
      },
    },
    SearchFilterModal: {
      screen: SearchFilterModal,
      navigationOptions: {
        title: 'Display Options',
      },
    },
    ImagesViewer: {
      screen: ImagesViewer,
    },
  },
  {
    mode: 'modal',
    cardStyle: {
      backgroundColor: '#fff',
    },
    headerMode: 'screen',
  },
);

export default AppNavigator;

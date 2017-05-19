import { StackNavigator } from 'react-navigation';
import MainNavigator from './MainNavigator';
import Login from '../screens/Login/Login';
import SearchFilterModal from '../components/SearchFilterModal';
import ImagesViewer from '../screens/ImagesViewer/ImagesViewer';

const AppNavigator = StackNavigator(
  {
    Main: {
      screen: MainNavigator,
      navigationOptions: {
        header: null,
      },
    },
    Login: {
      screen: Login,
      navigationOptions: ({ screenProps: { i18n } }) => ({
        title: i18n.login,
      }),
    },
    SearchFilterModal: {
      screen: SearchFilterModal,
      navigationOptions: ({ screenProps: { i18n } }) => ({
        title: i18n.displayOptions,
      }),
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

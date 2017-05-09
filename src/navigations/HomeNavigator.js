import { StackNavigator } from 'react-navigation';
import Home from '../screens/Home/Home';
import EnhanceRouter from './routers/EnhanceRouter';
import sharedRouteConfig from './routeConfigs/shared';

const HomeNavigator = StackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        header: null,
      },
    },
    ...sharedRouteConfig,
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerBackTitle: null,
    },
    cardStyle: {
      backgroundColor: '#fff',
    },
    headerMode: 'screen',
  },
);

export default EnhanceRouter(HomeNavigator);

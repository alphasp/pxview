import { StackNavigator } from 'react-navigation';
import UserProfile from '../screens/UserProfile/UserProfile';
import MyWorks from '../screens/UserProfile/MyWorks';
import MyConnection from '../screens/UserProfile/MyConnection/MyConnection';
import MyCollection from '../screens/UserProfile/MyCollection/MyCollection';
import BrowsingHistory from '../screens/UserProfile/BrowsingHistory';
import EnhanceRouter from './routers/EnhanceRouter';
import sharedRouteConfig from './routeConfigs/shared';

const UserProfileNavigator = StackNavigator(
  {
    UserProfile: {
      screen: UserProfile,
      navigationOptions: {
        header: null,
      },
    },
    MyConnection: {
      screen: MyConnection,
      path: '/me/connection',
      navigationOptions: {
        title: 'Connection',
      },
    },
    MyCollection: {
      screen: MyCollection,
      path: '/me/collection',
      navigationOptions: {
        title: 'Collection',
      },
    },
    MyWorks: {
      screen: MyWorks,
      navigationOptions: {
        title: 'My Works',
      },
    },
    BrowsingHistory: {
      screen: BrowsingHistory,
      navigationOptions: {
        title: 'Browsing History',
      },
    },
    ...sharedRouteConfig,
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

export default EnhanceRouter(UserProfileNavigator);

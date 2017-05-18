import { StackNavigator } from 'react-navigation';
import MyPage from '../screens/MyPage/MyPage';
import MyWorks from '../screens/MyPage/MyWorks';
import MyConnection from '../screens/MyPage/MyConnection/MyConnection';
import MyCollection from '../screens/MyPage/MyCollection/MyCollection';
import BrowsingHistory from '../screens/MyPage/BrowsingHistory';
import enhanceRouter from './routers/enhanceRouter';
import sharedRouteConfig from './routeConfigs/shared';

const MyPageNavigator = StackNavigator(
  {
    MyPage: {
      screen: MyPage,
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

export default enhanceRouter(MyPageNavigator);

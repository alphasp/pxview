import { StackNavigator } from 'react-navigation';
import Trending from '../screens/Trending/Trending';
import enhanceRouter from './routers/enhanceRouter';
import sharedRouteConfig from './routeConfigs/shared';

const TrendingNavigator = StackNavigator(
  {
    Trending: {
      screen: Trending,
      navigationOptions: {
        header: null,
      },
      // initialRouteParams: {
      //   isFocusSearchBar: false // not working now
      // }
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

export default enhanceRouter(TrendingNavigator);

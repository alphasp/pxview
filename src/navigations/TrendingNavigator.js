import { StackNavigator } from 'react-navigation';
import Trending from '../screens/Trending/Trending';
import enhanceRouter from './routers/enhanceRouter';
import sharedRouteConfig from './routeConfigs/shared';
import { globalStyles, globalStyleVariables } from '../styles';

const TrendingNavigator = StackNavigator(
  {
    Trending: {
      screen: Trending,
      navigationOptions: {
        header: null,
      },
    },
    ...sharedRouteConfig,
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: globalStyleVariables.HEADER_BACKGROUND_COLOR,
      },
      headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
      headerBackTitle: null,
    },
    cardStyle: globalStyles.card,
    headerMode: 'screen',
  },
);

export default enhanceRouter(TrendingNavigator);

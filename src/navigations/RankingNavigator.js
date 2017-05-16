import { StackNavigator } from 'react-navigation';
import Ranking from '../screens/Ranking/Ranking';
import enhanceRouter from './routers/enhanceRouter';
import sharedRouteConfig from './routeConfigs/shared';

const RankingNavigator = StackNavigator(
  {
    Ranking: {
      screen: Ranking,
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

export default enhanceRouter(RankingNavigator);

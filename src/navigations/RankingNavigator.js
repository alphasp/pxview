import { StackNavigator } from 'react-navigation';
import Ranking from '../screens/Ranking/Ranking';
import enhanceRouter from './routers/enhanceRouter';
import sharedRouteConfig from './routeConfigs/shared';
import { globalStyles, globalStyleVariables } from '../styles';

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
        backgroundColor: globalStyleVariables.HEADER_BACKGROUND_COLOR,
      },
      headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
    },
    cardStyle: globalStyles.card,
    headerMode: 'screen',
  },
);

export default enhanceRouter(RankingNavigator);

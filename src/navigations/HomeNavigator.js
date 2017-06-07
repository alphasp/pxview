import { StackNavigator } from 'react-navigation';
import Home from '../screens/Home/Home';
import enhanceRouter from './routers/enhanceRouter';
import sharedRouteConfig from './routeConfigs/shared';
import { globalStyles, globalStyleVariables } from '../styles';

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
        backgroundColor: globalStyleVariables.HEADER_BACKGROUND_COLOR,
      },
      headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
      headerBackTitle: null,
    },
    cardStyle: globalStyles.card,
    headerMode: 'screen',
  },
);

export default enhanceRouter(HomeNavigator);

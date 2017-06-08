import { StackNavigator } from 'react-navigation';
import NewWorks from '../screens/NewWorks/NewWorks';
import enhanceRouter from './routers/enhanceRouter';
import sharedRouteConfig from './routeConfigs/shared';
import { globalStyles, globalStyleVariables } from '../styles';

const NewWorksNavigator = StackNavigator(
  {
    NewWorks: {
      screen: NewWorks,
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

export default enhanceRouter(NewWorksNavigator);

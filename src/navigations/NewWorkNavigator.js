import { StackNavigator } from 'react-navigation';
import NewWorks from '../screens/NewWorks/NewWorks';
import enhanceRouter from './routers/enhanceRouter';
import sharedRouteConfig from './routeConfigs/shared';

const NewWorkNavigator = StackNavigator(
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

export default enhanceRouter(NewWorkNavigator);

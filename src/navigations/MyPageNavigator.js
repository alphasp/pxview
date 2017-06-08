import { StackNavigator } from 'react-navigation';
import enhanceRouter from './routers/enhanceRouter';
import sharedRouteConfig from './routeConfigs/shared';
import myPageRouteConfig from './routeConfigs/myPage';
import MyPage from '../screens/MyPage/MyPage';
import { globalStyles, globalStyleVariables } from '../styles';

const MyPageNavigator = StackNavigator(
  {
    MyPage: {
      screen: MyPage,
      navigationOptions: {
        header: null,
      },
    },
    ...myPageRouteConfig,
    ...sharedRouteConfig,
  },
  {
    headerMode: 'screen',
    navigationOptions: {
      headerStyle: {
        backgroundColor: globalStyleVariables.HEADER_BACKGROUND_COLOR,
      },
      headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
      headerBackTitle: null,
    },
    cardStyle: globalStyles.card,
  },
);

export default enhanceRouter(MyPageNavigator);

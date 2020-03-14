import { createStackNavigator } from '@react-navigation/stack';
import { createCompatNavigatorFactory } from '@react-navigation/compat';
import MyPage from '../screens/MyPage/MyPage';
import { globalStyles, globalStyleVariables } from '../styles';
import config from '../common/config';
import { SCREENS } from '../common/constants';

const routeConfig = {
  [SCREENS.MyPage]: {
    screen: MyPage,
    options: { header: null },
  },
};

const stackConfig = {
  headerMode: 'screen',
  screenOptions: {
    headerStyle: config.navigation.tab
      ? globalStyles.header
      : globalStyles.headerWithoutShadow,
    headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
    headerBackTitle: null,
  },
  cardStyle: globalStyles.card,
};

const MyPageNavigator = createCompatNavigatorFactory(createStackNavigator)(
  routeConfig,
  stackConfig,
);

export default MyPageNavigator;

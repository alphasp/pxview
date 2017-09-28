import React from 'react';
import { StackNavigator } from 'react-navigation';
import enhanceRouter from './routers/enhanceRouter';
import MyPage from '../screens/MyPage/MyPage';
import DrawerMenuButton from '../components/DrawerMenuButton';
import DrawerIcon from '../components/DrawerIcon';
import { globalStyles, globalStyleVariables } from '../styles';
import config from '../common/config';
import { SCREENS } from '../common/constants';

const navigationOptionsForTab = {
  header: null,
};

const navigationOptionsForDrawer = ({ navigation, screenProps: { i18n } }) => ({
  title: i18n.myPage,
  drawerLabel: i18n.myPage,
  drawerIcon: ({ tintColor }) => <DrawerIcon name="user" color={tintColor} />,
  headerLeft: (
    <DrawerMenuButton onPress={() => navigation.navigate('DrawerOpen')} />
  ),
});

const routeConfig = {
  [SCREENS.MyPage]: {
    screen: MyPage,
    navigationOptions: config.navigation.tab
      ? navigationOptionsForTab
      : navigationOptionsForDrawer,
  },
};

const stackConfig = {
  headerMode: 'screen',
  navigationOptions: {
    headerStyle: config.navigation.tab
      ? globalStyles.header
      : globalStyles.headerWithoutShadow,
    headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
    headerBackTitle: null,
  },
  cardStyle: globalStyles.card,
};

const MyPageNavigator = StackNavigator(routeConfig, stackConfig);

export default enhanceRouter(MyPageNavigator);

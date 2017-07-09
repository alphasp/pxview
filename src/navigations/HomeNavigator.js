import React from 'react';
import { StackNavigator } from 'react-navigation';
import enhanceRouter from './routers/enhanceRouter';
import sharedRouteConfig from './routeConfigs/shared';
import Home from '../screens/Home/Home';
import DrawerMenuButton from '../components/DrawerMenuButton';
import DrawerIcon from '../components/DrawerIcon';
import { globalStyles, globalStyleVariables } from '../styles';
import config from '../common/config';
import { SCREENS } from '../common/constants';

const navigationOptionsForTab = {
  header: null,
};

const navigationOptionsForDrawer = ({ navigation, screenProps: { i18n } }) => ({
  title: i18n.home,
  drawerLabel: i18n.home,
  drawerIcon: ({ tintColor }) =>
    <DrawerIcon name="home" size={24} color={tintColor} />,
  headerLeft: (
    <DrawerMenuButton onPress={() => navigation.navigate('DrawerOpen')} />
  ),
});

let routeConfig = {
  [SCREENS.Home]: {
    screen: Home,
    navigationOptions: config.navigation.tab
      ? navigationOptionsForTab
      : navigationOptionsForDrawer,
  },
};

if (config.navigation.tab) {
  routeConfig = {
    ...routeConfig,
    ...sharedRouteConfig,
  };
}

const stackConfig = {
  navigationOptions: {
    headerStyle: config.navigation.tab
      ? globalStyles.headerWithoutShadow
      : globalStyles.headerWithoutShadow,
    headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
    headerBackTitle: null,
  },
  cardStyle: globalStyles.card,
  headerMode: 'screen',
};

const HomeNavigator = StackNavigator(routeConfig, stackConfig);

export default enhanceRouter(HomeNavigator);

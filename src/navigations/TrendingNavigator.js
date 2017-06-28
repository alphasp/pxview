import React from 'react';
import { Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Trending from '../screens/Trending/Trending';
import enhanceRouter from './routers/enhanceRouter';
import sharedRouteConfig from './routeConfigs/shared';
import DrawerMenuButton from '../components/DrawerMenuButton';
import DrawerIcon from '../components/DrawerIcon';
import { globalStyles, globalStyleVariables } from '../styles';
import config from '../common/config';

const navigationOptionsForTab = {
  header: null,
};

const navigationOptionsForDrawer = ({ navigation, screenProps: { i18n } }) => ({
  header: null,
  drawerLabel: i18n.search,
  drawerIcon: ({ tintColor }) => <DrawerIcon name="search" color={tintColor} />,
  headerLeft: (
    <DrawerMenuButton onPress={() => navigation.navigate('DrawerOpen')} />
  ),
});

const TrendingNavigator = StackNavigator(
  {
    Trending: {
      screen: Trending,
      navigationOptions: config.navigation.tab
        ? navigationOptionsForTab
        : navigationOptionsForDrawer,
    },
    ...sharedRouteConfig,
  },
  {
    navigationOptions: {
      headerStyle: config.navigation.tab
        ? globalStyles.header
        : globalStyles.headerWithoutShadow,
      headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
      headerBackTitle: null,
    },
    cardStyle: globalStyles.card,
    headerMode: 'screen',
  },
);

export default enhanceRouter(TrendingNavigator);

import React from 'react';
import { StackNavigator } from 'react-navigation';
import Ranking from '../screens/Ranking/Ranking';
import enhanceRouter from './routers/enhanceRouter';
import sharedRouteConfig from './routeConfigs/shared';
import DrawerMenuButton from '../components/DrawerMenuButton';
import DrawerIcon from '../components/DrawerIcon';
import { globalStyles, globalStyleVariables } from '../styles';
import config from '../common/config';
import { SCREENS } from '../common/constants';

const navigationOptionsForTab = {
  header: null,
};

const navigationOptionsForDrawer = ({ navigation, screenProps: { i18n } }) => ({
  title: i18n.ranking,
  drawerLabel: i18n.ranking,
  drawerIcon: ({ tintColor }) => <DrawerIcon name="trophy" color={tintColor} />,
  headerLeft: (
    <DrawerMenuButton onPress={() => navigation.navigate('DrawerOpen')} />
  ),
});

const RankingNavigator = StackNavigator(
  {
    [SCREENS.Ranking]: {
      screen: Ranking,
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

export default enhanceRouter(RankingNavigator);

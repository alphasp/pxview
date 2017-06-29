import React from 'react';
import { StackNavigator } from 'react-navigation';
import NewWorks from '../screens/NewWorks/NewWorks';
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
  title: i18n.newest,
  drawerLabel: i18n.newest,
  drawerIcon: ({ tintColor }) => (
    <DrawerIcon name="fiber-new" type="material" color={tintColor} />
  ),
  headerLeft: (
    <DrawerMenuButton onPress={() => navigation.navigate('DrawerOpen')} />
  ),
});

const NewWorksNavigator = StackNavigator(
  {
    [SCREENS.NewWorks]: {
      screen: NewWorks,
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

export default enhanceRouter(NewWorksNavigator);

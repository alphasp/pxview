import React from 'react';
import { StackNavigator } from 'react-navigation';
import enhanceRouter from './routers/enhanceRouter';
import Recommended from '../screens/Recommended/Recommended';
import DrawerMenuButton from '../components/DrawerMenuButton';
import DrawerIcon from '../components/DrawerIcon';
import { globalStyles, globalStyleVariables } from '../styles';
import config from '../common/config';
import { SCREENS } from '../common/constants';

const navigationOptionsForTab = {
  header: null,
};

const navigationOptionsForDrawer = ({ navigation, screenProps: { i18n } }) => ({
  title: i18n.recommended,
  drawerLabel: i18n.recommended,
  drawerIcon: ({ tintColor }) =>
    <DrawerIcon name="thumbs-up" size={24} color={tintColor} />,
  headerLeft: (
    <DrawerMenuButton onPress={() => navigation.navigate('DrawerOpen')} />
  ),
});

const routeConfig = {
  [SCREENS.Recommended]: {
    screen: Recommended,
    navigationOptions: config.navigation.tab
      ? navigationOptionsForTab
      : navigationOptionsForDrawer,
  },
};

const stackConfig = {
  navigationOptions: {
    headerStyle: config.navigation.tab
      ? globalStyles.header
      : globalStyles.headerWithoutShadow,
    headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
    headerBackTitle: null,
  },
  cardStyle: globalStyles.card,
  headerMode: 'screen',
};

const RecommendedNavigator = StackNavigator(routeConfig, stackConfig);

export default enhanceRouter(RecommendedNavigator);

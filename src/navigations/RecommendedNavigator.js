import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Recommended from '../screens/Recommended/Recommended';
import DrawerMenuButton from '../components/DrawerMenuButton';
import DrawerIcon from '../components/DrawerIcon';
import {
  globalStyles,
  globalStyleVariables,
  getThemedHeaderStyle,
} from '../styles';
import config from '../common/config';
import { SCREENS } from '../common/constants';

const routeConfig = {
  [SCREENS.Recommended]: {
    screen: Recommended,
    navigationOptions: config.navigation.tab
      ? { header: null }
      : ({ navigation, screenProps: { i18n, theme } }) => ({
          title: i18n.recommended,
          headerStyle: getThemedHeaderStyle(theme, false),
          headerLeft: (
            <DrawerMenuButton onPress={() => navigation.openDrawer()} />
          ),
        }),
  },
};

const stackConfig = {
  defaultNavigationOptions: {
    headerStyle: config.navigation.tab
      ? globalStyles.header
      : globalStyles.headerWithoutShadow,
    headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
    headerBackTitle: null,
  },
  cardStyle: globalStyles.card,
  headerMode: 'screen',
};

const RecommendedNavigator = createStackNavigator(routeConfig, stackConfig);

if (!config.navigation.tab) {
  RecommendedNavigator.navigationOptions = ({ screenProps: { i18n } }) => ({
    drawerLabel: i18n.recommended,
    drawerIcon: ({ tintColor }) => (
      <DrawerIcon name="thumbs-up" size={24} color={tintColor} />
    ),
  });
}

export default RecommendedNavigator;

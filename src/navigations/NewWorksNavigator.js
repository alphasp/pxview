import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createCompatNavigatorFactory } from '@react-navigation/compat';
import NewWorks from '../screens/NewWorks/NewWorks';
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
  [SCREENS.NewWorks]: {
    screen: NewWorks,
    options: config.navigation.tab
      ? { header: null }
      : ({ navigation, screenProps: { i18n, theme } }) => ({
          title: i18n.newest,
          headerStyle: getThemedHeaderStyle(theme, false),
          headerLeft: () => (
            <DrawerMenuButton onPress={() => navigation.openDrawer()} />
          ),
        }),
  },
};

const stackConfig = {
  screenOptions: {
    headerStyle: config.navigation.tab
      ? globalStyles.header
      : globalStyles.headerWithoutShadow,
    headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
    headerBackTitle: null,
  },
  cardStyle: globalStyles.card,
  headerMode: 'screen',
};

const NewWorksNavigator = createCompatNavigatorFactory(createStackNavigator)(
  routeConfig,
  stackConfig,
);

if (!config.navigation.tab) {
  NewWorksNavigator.options = ({ screenProps: { i18n } }) => ({
    drawerLabel: i18n.newest,
    drawerIcon: ({ tintColor }) => (
      <DrawerIcon name="fiber-new" type="material" color={tintColor} />
    ),
  });
}

export default NewWorksNavigator;

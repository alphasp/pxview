import React from 'react';
import { createStackNavigator } from 'react-navigation';
import Trending from '../screens/Trending/Trending';
import DrawerMenuButton from '../components/DrawerMenuButton';
import DrawerIcon from '../components/DrawerIcon';
import { globalStyles, globalStyleVariables } from '../styles';
import config from '../common/config';
import { SCREENS } from '../common/constants';

const routeConfig = {
  [SCREENS.Trending]: {
    screen: Trending,
    navigationOptions: config.navigation.tab
      ? { header: null }
      : ({ navigation }) => ({
          header: null,
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

const TrendingNavigator = createStackNavigator(routeConfig, stackConfig);

if (!config.navigation.tab) {
  TrendingNavigator.navigationOptions = ({ screenProps: { i18n } }) => ({
    drawerLabel: i18n.search,
    drawerIcon: ({ tintColor }) => (
      <DrawerIcon name="search" color={tintColor} />
    ),
  });
}

export default TrendingNavigator;

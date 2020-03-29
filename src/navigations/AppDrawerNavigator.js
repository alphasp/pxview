import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import RecommendedNavigator from './RecommendedNavigator';
import RankingNavigator from './RankingNavigator';
import TrendingNavigator from './TrendingNavigator';
import NewWorksNavigator from './NewWorksNavigator';
import DrawerContent from '../components/DrawerContent';
import DrawerIcon from '../components/DrawerIcon';
import { useLocalization } from '../components/Localization';
import { globalStyles, globalStyleVariables } from '../styles';
import { SCREENS } from '../common/constants';

const Drawer = createDrawerNavigator();

const createAppDrawerNavigator = ({ initialRouteName }) => {
  const { i18n } = useLocalization();
  return (
    <Drawer.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerStyle: globalStyles.header,
        headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
      }}
      unmountInactiveRoutes
      cardStyle={globalStyles.card}
      drawerContent={(props) => <DrawerContent {...props} />}
      overlayColor="#00000090"
    >
      <Drawer.Screen
        name={SCREENS.Recommended}
        component={RecommendedNavigator}
        options={{
          drawerLabel: i18n.recommended,
          drawerIcon: ({ color }) => (
            <DrawerIcon name="thumbs-up" color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name={SCREENS.RankingPreview}
        component={RankingNavigator}
        options={{
          drawerLabel: i18n.ranking,
          drawerIcon: ({ color }) => <DrawerIcon name="trophy" color={color} />,
        }}
      />
      <Drawer.Screen
        name={SCREENS.Trending}
        component={TrendingNavigator}
        options={{
          drawerLabel: i18n.search,
          drawerIcon: ({ color }) => <DrawerIcon name="search" color={color} />,
        }}
      />
      <Drawer.Screen
        name={SCREENS.NewWorks}
        component={NewWorksNavigator}
        options={{
          drawerLabel: i18n.newest,
          drawerIcon: ({ color }) => (
            <DrawerIcon name="fiber-new" type="material" color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default createAppDrawerNavigator;

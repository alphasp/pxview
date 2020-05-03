import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Icon } from 'react-native-elements';
import { useTheme } from 'react-native-paper';
import Recommended from '../screens/Recommended/Recommended';
import RankingPreview from '../screens/Ranking/RankingPreview';
import Trending from '../screens/Trending/Trending';
import NewWorks from '../screens/NewWorks/NewWorks';
import MyPage from '../screens/MyPage/MyPage';
import { SCREENS } from '../common/constants';
import { useLocalization } from '../components/Localization';

const Tab = createMaterialBottomTabNavigator();

const TabBarIcon = ({ color, name, iconType }) => (
  <Icon name={name} type={iconType || 'font-awesome'} size={24} color={color} />
);

const AppTabNavigator = ({ initialRouteName }) => {
  const { i18n } = useLocalization();
  const theme = useTheme();
  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      labeled
      barStyle={{
        backgroundColor: theme.colors.bottomTabBarBackground,
      }}
    >
      <Tab.Screen
        name={SCREENS.Recommended}
        component={Recommended}
        options={{
          tabBarLabel: i18n.recommended,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="thumbs-up" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.RankingPreview}
        component={RankingPreview}
        options={{
          tabBarLabel: i18n.ranking,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="trophy" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.Trending}
        component={Trending}
        options={{
          tabBarLabel: i18n.search,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="search" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.NewWorks}
        component={NewWorks}
        options={{
          tabBarLabel: i18n.newest,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="fiber-new"
              iconType="material"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.MyPageTab}
        component={MyPage}
        options={{
          tabBarLabel: i18n.myPage,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="user" color={color} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabNavigator;

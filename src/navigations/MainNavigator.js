import React from 'react';
import { TabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { NavigationComponent } from 'react-native-material-bottom-navigation';
import HomeNavigator from './HomeNavigator';
import RankingNavigator from './RankingNavigator';
import TrendingNavigator from './TrendingNavigator';
import NewWorkNavigator from './NewWorkNavigator';
import MyPageNavigator from './MyPageNavigator';

const renderTabBarIcon = (
  tintColor,
  focused,
  name,
  iconType, // 59,89,152
) => (
  <Icon
    name={name}
    type={iconType || 'font-awesome'}
    size={24}
    color={tintColor}
  />
);

const MainNavigator = TabNavigator(
  {
    HomeTab: {
      screen: HomeNavigator,
      path: '/home',
      navigationOptions: {
        title: 'home',
        // tabBar: () => ({
        //   label: 'Home',
        //   icon: ({ tintColor, focused }) => (
        //     renderTabBarIcon(tintColor, focused, "home")
        //   ),
        // }),
        tabBarIcon: ({ tintColor, focused }) =>
          renderTabBarIcon(tintColor, focused, 'home'),
        // tabBarLabel: 'Home',
      },
    },
    RankingTab: {
      screen: RankingNavigator,
      path: '/ranking',
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) =>
          renderTabBarIcon(tintColor, focused, 'trophy'),
        // tabBarLabel: 'Ranking',
      },
    },
    TrendingTab: {
      screen: TrendingNavigator,
      path: '/trending',
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) =>
          renderTabBarIcon(tintColor, focused, 'search'),
        // tabBarLabel: 'Search',
      },
    },
    NewWorkTab: {
      screen: NewWorkNavigator,
      path: '/newwork',
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) =>
          renderTabBarIcon(tintColor, focused, 'fiber-new', 'material'),
        // tabBarLabel: 'Newest',
      },
    },
    MyPageTab: {
      screen: MyPageNavigator,
      path: '/profile',
      navigationOptions: {
        tabBarIcon: ({ tintColor, focused }) =>
          renderTabBarIcon(tintColor, focused, 'user'),
        // tabBarLabel: 'Profile',
      },
    },
  },
  {
    headerMode: 'none',
    swipeEnabled: false,
    animationEnabled: false,
    lazy: true,
    tabBarPosition: 'bottom',
    tabBarComponent: NavigationComponent,
    tabBarOptions: {
      activeTintColor: 'rgb(59,89,152)',
      inactiveTintColor: 'rgb(204,204,204)',
      showIcon: true,
      showLabel: true,
      bottomNavigationOptions: {
        style: {
          borderTopWidth: 0,
          elevation: 8,
        },
        labelColor: 'rgb(59,89,152)',
        tabs: {
          HomeTab: {},
          Rankingtab: {
            // barBackgroundColor: '#EEEEEE',
          },
          TrendingTab: {
            // barBackgroundColor: '#EEEEEE',
            // barBackgroundColor: '#EEEEEE',
            // labelColor: '#434343',
          },
          NewWorkTab: {
            // barBackgroundColor: '#EEEEEE',
          },
          MyPageTab: {
            // barBackgroundColor: '#EEEEEE',
          },
        },
      },
    },
  },
);

export default MainNavigator;

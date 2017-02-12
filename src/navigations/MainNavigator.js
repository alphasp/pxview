import React, { Component } from 'react';
import { TabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import HomeNavigator from './HomeNavigator';
import RankingNavigator from './RankingNavigator';
import TrendingNavigator from './TrendingNavigator';
import NewWorkNavigator from './NewWorkNavigator';
import UserProfileNavigator from './UserProfileNavigator';

const renderTabBarIcon = (tintColor, focused, name, iconType) => {
  return (
    <Icon
      name={name}
      type={iconType || "font-awesome"}
      size={30}
      color={tintColor}
    />
  );
}

const MainNavigator = TabNavigator({
  HomeTab: { 
    screen: HomeNavigator,
    path: '/home',
    navigationOptions: {
      title: 'home',
      tabBar: () => ({
        label: 'Home',
        icon: ({tintColor, focused}) => (
          renderTabBarIcon(tintColor, focused, "home")
        ),
      }),
    } 
  },
  RankingTab: { 
    screen: RankingNavigator,
    path: '/ranking',
    navigationOptions: {
      tabBar: () => ({
        label: 'Ranking',
        icon: ({tintColor, focused}) => (
          renderTabBarIcon(tintColor, focused, "trophy")
        ),
      }),
    }  
  },
  TrendingTab: { 
    screen: TrendingNavigator,
    path: '/trending',
    navigationOptions: {
      tabBar: () => ({
        label: 'Search',
        icon: ({tintColor, focused}) => (
          renderTabBarIcon(tintColor, focused, "search")
        ),
      }),
    }  
  },
  NewWorkTab: { 
    screen: NewWorkNavigator,
    path: '/newwork',
    navigationOptions: {
      tabBar: () => ({
        label: 'Newest',
        icon: ({tintColor, focused}) => (
          renderTabBarIcon(tintColor, focused, "fiber-new", "material")
        ),
      }),
    }  
  },
  UserProfileTab: { 
    screen: UserProfileNavigator,
    path: '/profile',
    navigationOptions: {
      tabBar: () => ({
        label: 'Profile',
        icon: ({tintColor, focused}) => (
          renderTabBarIcon(tintColor, focused, "user")
        ),
      }),
    }  
  },
}, {
  headerMode: 'none',
  tabBarOptions: {
    activeTintColor: 'rgb(59,89,152)',
    inactiveTintColor: 'rgb(204,204,204)',
    showIcon: true,
    showLabel: true,
  },
  swipeEnabled: false,
  tabBarPosition: 'bottom',
  lazyLoad: true,
});

export default MainNavigator
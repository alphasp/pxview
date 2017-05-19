import React from 'react';
import { Platform } from 'react-native';
import { TabNavigator, TabBarBottom } from 'react-navigation';
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
      navigationOptions: ({ screenProps: { i18n } }) => ({
        tabBarLabel: i18n.home,
        tabBarIcon: ({ tintColor, focused }) =>
          renderTabBarIcon(tintColor, focused, 'home'),
      }),
    },
    RankingTab: {
      screen: RankingNavigator,
      navigationOptions: ({ screenProps: { i18n } }) => ({
        tabBarLabel: i18n.ranking,
        tabBarIcon: ({ tintColor, focused }) =>
          renderTabBarIcon(tintColor, focused, 'trophy'),
      }),
    },
    TrendingTab: {
      screen: TrendingNavigator,
      navigationOptions: ({ screenProps: { i18n } }) => ({
        tabBarLabel: i18n.search,
        tabBarIcon: ({ tintColor, focused }) =>
          renderTabBarIcon(tintColor, focused, 'search'),
      }),
    },
    NewWorkTab: {
      screen: NewWorkNavigator,
      navigationOptions: ({ screenProps: { i18n } }) => ({
        tabBarLabel: i18n.newest,
        tabBarIcon: ({ tintColor, focused }) =>
          renderTabBarIcon(tintColor, focused, 'fiber-new', 'material'),
      }),
    },
    MyPageTab: {
      screen: MyPageNavigator,
      navigationOptions: ({ screenProps: { i18n } }) => ({
        tabBarLabel: i18n.myPage,
        tabBarIcon: ({ tintColor, focused }) =>
          renderTabBarIcon(tintColor, focused, 'user'),
      }),
    },
  },
  {
    headerMode: 'none',
    swipeEnabled: false,
    animationEnabled: false,
    lazy: true,
    tabBarPosition: 'bottom',
    tabBarComponent: Platform.OS === 'android'
      ? NavigationComponent
      : TabBarBottom,
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

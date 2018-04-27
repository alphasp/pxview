import React from 'react';
import { Platform } from 'react-native';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { NavigationComponent } from 'react-native-material-bottom-navigation';
import RecommendedNavigator from './RecommendedNavigator';
import RankingNavigator from './RankingNavigator';
import TrendingNavigator from './TrendingNavigator';
import NewWorksNavigator from './NewWorksNavigator';
import MyPageNavigator from './MyPageNavigator';
import Recommended from '../screens/Recommended/Recommended';
import Ranking from '../screens/Ranking/Ranking';
import Trending from '../screens/Trending/Trending';
import NewWorks from '../screens/NewWorks/NewWorks';
import MyPage from '../screens/MyPage/MyPage';
import { SCREENS } from '../common/constants';

const renderTabBarIcon = (tintColor, focused, name, iconType) =>
  <Icon
    name={name}
    type={iconType || 'font-awesome'}
    size={24}
    color={tintColor}
  />;

const createAppTabNavigator = ({ initialRouteName }) =>
  TabNavigator(
    {
      [SCREENS.RecommendedTab]: {
        screen: Platform.OS === 'android' ? Recommended : RecommendedNavigator,
        navigationOptions: ({ screenProps: { i18n } }) => ({
          tabBarLabel: i18n.recommended,
          tabBarIcon: ({ tintColor, focused }) =>
            renderTabBarIcon(tintColor, focused, 'thumbs-up'),
        }),
      },
      [SCREENS.RankingTab]: {
        screen: Platform.OS === 'android' ? Ranking : RankingNavigator,
        navigationOptions: ({ screenProps: { i18n } }) => ({
          tabBarLabel: i18n.ranking,
          tabBarIcon: ({ tintColor, focused }) =>
            renderTabBarIcon(tintColor, focused, 'trophy'),
        }),
      },
      [SCREENS.TrendingTab]: {
        screen: Platform.OS === 'android' ? Trending : TrendingNavigator,
        navigationOptions: ({ screenProps: { i18n } }) => ({
          tabBarLabel: i18n.search,
          tabBarIcon: ({ tintColor, focused }) =>
            renderTabBarIcon(tintColor, focused, 'search'),
        }),
      },
      [SCREENS.NewWorksTab]: {
        screen: Platform.OS === 'android' ? NewWorks : NewWorksNavigator,
        navigationOptions: ({ screenProps: { i18n } }) => ({
          tabBarLabel: i18n.newest,
          tabBarIcon: ({ tintColor, focused }) =>
            renderTabBarIcon(tintColor, focused, 'fiber-new', 'material'),
        }),
      },
      [SCREENS.MyPageTab]: {
        screen: Platform.OS === 'android' ? MyPage : MyPageNavigator,
        navigationOptions: ({ screenProps: { i18n } }) => ({
          tabBarLabel: i18n.myPage,
          tabBarIcon: ({ tintColor, focused }) =>
            renderTabBarIcon(tintColor, focused, 'user'),
        }),
      },
    },
    {
      initialRouteName: `${initialRouteName}Tab`,
      headerMode: 'none',
      lazy: true,
      swipeEnabled: false,
      animationEnabled: false,
      tabBarPosition: 'bottom',
      tabBarComponent:
        Platform.OS === 'android' ? NavigationComponent : TabBarBottom,
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
            RecommendedTab: {},
            Rankingtab: {
              // barBackgroundColor: '#EEEEEE',
            },
            TrendingTab: {
              // barBackgroundColor: '#EEEEEE',
              // barBackgroundColor: '#EEEEEE',
              // labelColor: '#434343',
            },
            NewWorksTab: {
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

export default createAppTabNavigator;

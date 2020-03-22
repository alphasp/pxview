import React from 'react';
import { Platform } from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import { Icon } from 'react-native-elements';
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

const renderTabBarIcon = (tintColor, focused, name, iconType) => (
  <Icon
    name={name}
    type={iconType || 'font-awesome'}
    size={24}
    color={tintColor}
  />
);

const tabBarComponent = (props) => {
  const { theme } = props.screenProps;
  return (
    <BottomTabBar
      {...props}
      activeBackgroundColor={theme.colors.background}
      inactiveBackgroundColor={theme.colors.background}
      activeTintColor={theme.colors.primary}
    />
  );
};

const createAppTabNavigator = ({ initialRouteName }) =>
  createBottomTabNavigator(
    {
      [SCREENS.RecommendedTab]: {
        screen: Platform.OS === 'android' ? Recommended : RecommendedNavigator,
        options: ({ screenProps: { i18n } }) => ({
          tabBarLabel: i18n.recommended,
          tabBarIcon: ({ tintColor, focused }) =>
            renderTabBarIcon(tintColor, focused, 'thumbs-up'),
        }),
      },
      [SCREENS.RankingTab]: {
        screen: Platform.OS === 'android' ? Ranking : RankingNavigator,
        options: ({ screenProps: { i18n } }) => ({
          tabBarLabel: i18n.ranking,
          tabBarIcon: ({ tintColor, focused }) =>
            renderTabBarIcon(tintColor, focused, 'trophy'),
        }),
      },
      [SCREENS.TrendingTab]: {
        screen: Platform.OS === 'android' ? Trending : TrendingNavigator,
        options: ({ screenProps: { i18n } }) => ({
          tabBarLabel: i18n.search,
          tabBarIcon: ({ tintColor, focused }) =>
            renderTabBarIcon(tintColor, focused, 'search'),
        }),
      },
      [SCREENS.NewWorksTab]: {
        screen: Platform.OS === 'android' ? NewWorks : NewWorksNavigator,
        options: ({ screenProps: { i18n } }) => ({
          tabBarLabel: i18n.newest,
          tabBarIcon: ({ tintColor, focused }) =>
            renderTabBarIcon(tintColor, focused, 'fiber-new', 'material'),
        }),
      },
      [SCREENS.MyPageTab]: {
        screen: Platform.OS === 'android' ? MyPage : MyPageNavigator,
        options: ({ screenProps: { i18n } }) => ({
          tabBarLabel: i18n.myPage,
          tabBarIcon: ({ tintColor, focused }) =>
            renderTabBarIcon(tintColor, focused, 'user'),
        }),
      },
    },
    {
      tabBarComponent,
      initialRouteName: `${initialRouteName}Tab`,
      headerMode: 'none',
      lazy: true,
      swipeEnabled: false,
      animationEnabled: false,
      tabBarOptions: {
        showIcon: true,
        showLabel: true,
      },
    },
  );

export default createAppTabNavigator;

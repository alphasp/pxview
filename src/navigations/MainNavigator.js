import React, { Component } from 'react';
import { TabNavigator, TabRouter } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { NavigationComponent } from 'react-native-material-bottom-navigation';
import HomeNavigator from './HomeNavigator';
import RankingNavigator from './RankingNavigator';
import TrendingNavigator from './TrendingNavigator';
import NewWorkNavigator from './NewWorkNavigator';
import UserProfileNavigator from './UserProfileNavigator';

const renderTabBarIcon = (tintColor, focused, name, iconType) =>
  // 59,89,152
   (
     <Icon
       name={name}
       type={iconType || 'font-awesome'}
       size={24}
       color={tintColor}
     />
  );

const MainNavigator = TabNavigator({
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
      tabBarIcon: ({ tintColor, focused }) => (
        renderTabBarIcon(tintColor, focused, 'home')
      ),
      tabBarLabel: 'Home',
    },
  },
  RankingTab: {
    screen: RankingNavigator,
    path: '/ranking',
    navigationOptions: {
      tabBarIcon: ({ tintColor, focused }) => (
        renderTabBarIcon(tintColor, focused, 'trophy')
      ),
      tabBarLabel: 'Ranking',
    },
  },
  TrendingTab: {
    screen: TrendingNavigator,
    path: '/trending',
    navigationOptions: {
      tabBarIcon: ({ tintColor, focused }) => (
        renderTabBarIcon(tintColor, focused, 'search')
      ),
      tabBarLabel: 'Search',
    },
  },
  NewWorkTab: {
    screen: NewWorkNavigator,
    path: '/newwork',
    navigationOptions: {
      tabBarIcon: ({ tintColor, focused }) => (
        renderTabBarIcon(tintColor, focused, 'fiber-new', 'material')
      ),
      tabBarLabel: 'Newest',
    },
  },
  UserProfileTab: {
    screen: UserProfileNavigator,
    path: '/profile',
    navigationOptions: {
      tabBarIcon: ({ tintColor, focused }) => (
        renderTabBarIcon(tintColor, focused, 'user')
      ),
      tabBarLabel: 'Profile',
    },
  },
}, {
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
        HomeTab: {

        },
        Rankingtab: {
          // barBackgroundColor: '#EEEEEE',
        },
        TrendingTab: {
          // barBackgroundColor: '#EEEEEE',
          // barBackgroundColor: '#EEEEEE',
          // labelColor: '#434343', // like in the standalone version, this will override the already specified `labelColor` for this tab
        },
        NewWorkTab: {
          // barBackgroundColor: '#EEEEEE',
        },
        UserProfileTab: {
          // barBackgroundColor: '#EEEEEE',
        },
      },
    },
  },
});

// const router = MainNavigator.router;
// MainNavigator.router = {
//   ...MainNavigator.router,
//   getStateForAction(action, state) {
//     console.log('router ', action, state)
//     if (state && state.index && state.routes) {
//     // if (state && action.type === 'goBackAndSetParams') {
//       const lastRoute = state.routes[state.index].routes.find(route => route.key === action.key);
//       console.log('last route ', lastRoute)
//       if (lastRoute) {
//         const params = {
//           ...lastRoute.params,
//           ...action.params,
//         };
//         return {
//           ...state,
//           routes: state.routes.map(route => {
//             return {
//               ...route,
//               routes: route.routes.map(r =>
//                 r.key === action.key ?
//                 { ...r, params }
//                 :
//                 r
//               )
//             }
//           }),
//         };
//       }
//     }
//     return router.getStateForAction(action, state);
//   },
// };

export default MainNavigator;

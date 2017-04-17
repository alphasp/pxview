import React, { Component } from 'react';
import { TabNavigator, TabRouter } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { NavigationComponent } from 'react-native-material-bottom-navigation';
import HomeNavigator from './HomeNavigator';
import RankingNavigator from './RankingNavigator';
import TrendingNavigator from './TrendingNavigator';
import NewWorkNavigator from './NewWorkNavigator';
import UserProfileNavigator from './UserProfileNavigator';

const renderTabBarIcon = (tintColor, focused, name, iconType) => {
  //59,89,152
  return (
    <Icon
      name={name}
      type={iconType || "font-awesome"}
      size={24}
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
      // tabBar: () => ({
      //   label: 'Home',
      //   icon: ({ tintColor, focused }) => (
      //     renderTabBarIcon(tintColor, focused, "home")
      //   ),
      // }),
      tabBar: ({ state }) => ({
        label: 'Home',
        icon: ({ tintColor, focused }) => (
          renderTabBarIcon(tintColor, focused, "home")
        ),
        onTabPress: (props) => {
          console.log('on tab press ', props)
        }
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
  swipeEnabled: false,
  lazyLoad: true,
  tabBarPosition: 'bottom',
  tabBarComponent: NavigationComponent,
  tabBarOptions: {
    activeTintColor: 'rgb(59,89,152)',
    inactiveTintColor: 'rgb(204,204,204)',
    showIcon: true,
    showLabel: true,
    bottomNavigationOptions: {
      labelColor: 'rgb(59,89,152)',
      tabs: {
        HomeTab: {

        },
        Rankingtab: {
          //barBackgroundColor: '#EEEEEE',
        },
        TrendingTab: {
          //barBackgroundColor: '#EEEEEE',
          // barBackgroundColor: '#EEEEEE',
          // labelColor: '#434343', // like in the standalone version, this will override the already specified `labelColor` for this tab
        },
        NewWorkTab: {
          //barBackgroundColor: '#EEEEEE',
        },
        UserProfileTab: {
          //barBackgroundColor: '#EEEEEE',
        }
      }
    }
  }
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
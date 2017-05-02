import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import MainNavigator from './MainNavigator';
import Login from '../containers/Login';
import SearchFilterModal from '../components/SearchFilterModal';
import ImagesViewer from '../containers/ImagesViewer';
import PXWebView from '../components/PXWebView';

const AppNavigator = StackNavigator({
  Main: {
    screen: MainNavigator,
    path: '/',
    navigationOptions: {
      header: null,
    },
  },
  Login: {
    screen: Login,
    path: '/login',
    navigationOptions: {
      title: 'Login',
    },
  },
  SearchFilterModal: {
    screen: SearchFilterModal,
    navigationOptions: {
      title: 'Display Options',
    },
  },
  ImagesViewer: {
    screen: ImagesViewer,
  },
  Web: {
    screen: PXWebView,
  },
}, {
  mode: 'modal',
  cardStyle: {
    backgroundColor: '#fff',
  },
  headerMode: 'screen',

});

export default AppNavigator;

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { 
  Actions, 
  Scene, 
  Router, 
  Modal, 
  Reducer, 
  ActionConst,
} from 'react-native-router-flux';
import { connect, Provider } from 'react-redux';
import Tabs from './Tabs';
import TempComp from './TempComp';

global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

const RouterWithRedux = connect()(Router);

const getSceneStyle = function (props, computedProps) {
  const style = {
    flex: 1,
    //backgroundColor:'rgba(255,255,255,0.5)'
    // backgroundColor: '#fff',
    // shadowColor: null,
    // shadowOffset: null,
    // shadowOpacity: null,
    // shadowRadius: null,
  };
  if (computedProps.isActive) {
    if (Platform.OS === 'ios') {
      style.marginTop = computedProps.hideNavBar ? 0 : 64;
    }
    else {
      style.marginTop = computedProps.hideNavBar ? 0 : 54;
    }
    //style.marginBottom = computedProps.hideTabBar ? 0 : 50;
  }
  return style;
}

const styles = StyleSheet.create({
  // navBar: {
  //   backgroundColor: '#1F3B5B',
  //   borderBottomWidth: 0
  //   // color: 'rgba(0,0,0,.87)',
  //   // leftIconColor: 'rgba(0,0,0,.54)',
  //   // rightIconColor: 'rgba(0,0,0,.54)'
  // },
  header: {
    backgroundColor: '#5cafec',
  },
  title: {
    color: '#fff'
  },
  leftButton: {
    width: 22, 
    height: 22
  },
  rightButton: {
    width: 22, 
    height: 22
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gg: null,
    };
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content', true)
    }
  }
  render() {
    const { store } = this.props;
    return (
      <Provider store={ store }>
        <RouterWithRedux getSceneStyle={ getSceneStyle }>
          <Scene key="modal" component={ Modal } >
            <Scene key="root">
              <Scene key="scenes" navigationBarStyle={styles.header}>
                <Scene key="tabs" component={ Tabs } title="Pixiv RN"  />
                <Scene key="temp" 
                  component={ TempComp } 
                  title="Temp" 
                />
              </Scene>
            </Scene>
          </Scene>
        </RouterWithRedux>
      </Provider>
    );
  }
}

export default App;

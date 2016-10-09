import React, { Component } from 'react';
import {
  // View,
  StyleSheet,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Home from './Home';
import Search from './Search';
import Setting from './Setting';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // justifyContent: 'center',
//     // alignItems: 'center',
//     // backgroundColor: '#F5FCFF',
//   },
// });

class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gg: null,
    };
  }
  render() {
    console.log('Tabs');
    console.log('children ', this.props.children);
    return (
      <ScrollableTabView 
        tabBarPosition="bottom" 
        locked 
        scrollWithoutAnimation
      >
        <Home tabLabel="Home" />
        <Search tabLabel="Search" />
        <Setting tabLabel="Setting" />
      </ScrollableTabView>
    );
  }
}

export default Tabs;

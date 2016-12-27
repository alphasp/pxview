import React, { Component } from 'react';
import {
  // View,
  StyleSheet,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { DefaultRenderer, Actions, ActionConst } from 'react-native-router-flux';
import NavigationTabBar from '../components/NavigationTabBar';
// import Home from './Home';
// import Search from './Search';
// import Setting from './Setting';

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
  }
  // onChangeTab = ({ ref }) => {
  //   console.log('ref.props.sceneKey ', ref.props.sceneKey )
  //   Actions[ref.props.sceneKey]();
  // }
  render() {
    // console.log('Tabs');
    // console.log('children ', this.props.children);
    // return (
    //   <ScrollableTabView 
    //     tabBarPosition="bottom" 
    //     locked 
    //     scrollWithoutAnimation
    //   >
    //     <Home tabLabel="Home" />
    //     <Search tabLabel="Search" />
    //     <Setting tabLabel="Setting" />
    //   </ScrollableTabView>
    // );
    const state = this.props.navigationState;
    //const { navigationState: { children }, notifications } = this.props;
    // renderTabBar={() => <TabBar /> }
    return (
      <ScrollableTabView 
        tabBarPosition="bottom" 
        locked 
        scrollWithoutAnimation 
        renderTabBar={() => <NavigationTabBar />}
      >
        {
          state.children.map(el =>{
            return (
              <DefaultRenderer navigationState={el} onNavigate={this.props.onNavigate} key={el.key} tabLabel={{title: el.title, icon: el.icon, iconType: el.iconType}} {...el} />
            );
          })
        }
      </ScrollableTabView>
    );
    // return (
    //   <ScrollableTabView 
    //     tabBarPosition="bottom" 
    //     locked 
    //     scrollWithoutAnimation
    //   >
    //     <Home tabLabel="Home" />
    //     <Search tabLabel="Search" />
    //     <Setting tabLabel="Setting" />
    //   </ScrollableTabView>
    // );
  }
}

export default Tabs;

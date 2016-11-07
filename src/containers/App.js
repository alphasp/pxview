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
import Detail from './Detail';
import TempComp from './TempComp';
import Home from './Home';
import Trending from './Trending';
import Search from './Search';
// import SearchResult from './SearchResult';
import SearchResultTabs from './SearchResultTabs';
import Setting from './Setting';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';

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
    if (Platform.OS === 'ios') {
      //StatusBar.setBarStyle('light-content', true)
      StatusBar.setBarStyle('default');
    }
  }
  handleOnSearchFieldFocus = () => {
    console.log('on focus');
    Actions.search();
  }
  handleOnChangeSearchText = () => {

  }
  handleOnSubmitSearch = (word) => {
    console.log('submit ', word)
    if (word) {
      Actions.searchResultTabs({ word: word });
    }
  }
  render() {
    const { store } = this.props;
    return (
      <Provider store={ store }>
        <RouterWithRedux getSceneStyle={ getSceneStyle }>
          <Scene key="modal" component={ Modal }>
            <Scene key="root">
              <Scene 
                key="scenes" 
                navigationBarStyle={styles.header} 
                panHandlers={null}
                leftButtonStyle={{ width: 30 }}
              >
                <Scene key="tabs" component={ Tabs } title="Pixiv RN" tabs={true} duration={0}>
                  <Scene key="home"
                    title="Home"
                    component={ Home }
                    navigationBarStyle={styles.header}
                    hideNavBar={true}
                  />
                  <Scene key="trending"
                    title="Search"
                    component={ Trending }
                    navigationBarStyle={styles.header}
                    renderTitle={ () => {
                      return (
                        <Header>
                          <SearchBar 
                            onFocus={this.handleOnSearchFieldFocus}  
                            isRenderPlaceHolder={true}
                          />
                        </Header>
                      )
                    }}
                  />
                  <Scene key="setting"
                    title="Setting"
                    component={ Setting }
                    navigationBarStyle={styles.header}
                  />
                </Scene>
                <Scene key="detail"
                  title="Detail"
                  component={ Detail }
                  duration={0}
                />
                <Scene key="search"
                  title="Search"
                  component={ Search }
                  navigationBarStyle={styles.header}
                  duration={0}
                  renderTitle={ () => {
                    return (
                      <Header>
                        <SearchBar 
                          enableBack={true} 
                          autoFocus={true} 
                          onSubmitEditing={this.handleOnSubmitSearch}
                        />
                      </Header>
                    )
                  }}
                />
                <Scene key="searchResultTabs"
                  title="Search"
                  component={ SearchResultTabs }
                  navigationBarStyle={styles.header}
                />
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

// <Scene key="searchResult"
//   title="Search"
//   component={ SearchResult }
//   navigationBarStyle={styles.header}
// />
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { TabViewAnimated, TabBar, TabViewPagerScroll, TabViewPagerPan } from 'react-native-tab-view';
import PXTabView from '../components/PXTabView';
import RecommendedIllusts from './RecommendedIllusts';
import RecommendedMangas from './RecommendedMangas';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
    // ...Platform.select({
    //   ios: {
    //     marginTop: 15
    //   },
    // }),
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    paddingTop: STATUSBAR_HEIGHT
  }
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: '1', title: 'Illustration' },
        { key: '2', title: 'Manga' },
      ],
    };
  }
  
  handleChangeTab = (index) => {
    this.setState({ index });
  };

  renderScene = ({ route }) => {
    const { navigation, screenProps } = this.props;
    switch (route.key) {
      // case '1':
      //   return <View style={[ styles.page, { backgroundColor: '#ff4081' } ]} />;
      // case '2':
      //   return <View style={[ styles.page, { backgroundColor: '#673ab7' } ]} />;
      case '1':
        return <RecommendedIllusts navigation={navigation} screenProps={screenProps} />
      case '2':
        return <RecommendedMangas navigation={navigation} screenProps={screenProps} />
      default:
        return null;
    };
  }

  renderHeader = (props) => {
    return <TabBar style={styles.tabBar} {...props} />;
  };

  renderPager = (props) => {
   return (Platform.OS === 'ios') ? <TabViewPagerScroll {...props} /> : <TabViewPagerPan {...props} />
  }

  render() {
    const { navigation, screenProps } = this.props;
    return (
      <PXTabView
        renderHeader={this.renderHeader}
        navigationState={this.state}
        renderScene={this.renderScene}
        onRequestChangeTab={this.handleChangeTab}
      />
    );
  }
}

export default Home;

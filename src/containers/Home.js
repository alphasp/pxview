import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import RecommendedIllusts from './RecommendedIllusts';
import RecommendedMangas from './RecommendedMangas';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
    ...Platform.select({
      ios: {
        marginTop: 15
      },
    }),
  },
});

class Home extends Component {
  componentDidMount() {
    // hack for android for nested tabs https://github.com/skv-headless/react-native-scrollable-tab-view/issues/215
    if (Platform.OS === 'android') {
      setTimeout(() => this.tabs.goToPage(0), 0);
    }
  }
  
  render() {
    const { navigation, screenProps } = this.props;
    return (
      <View style={styles.container}>
        <ScrollableTabView ref={(ref) => this.tabs = ref}>
          <RecommendedIllusts tabLabel="Illustrations" navigation={navigation} screenProps={screenProps} />
          <RecommendedMangas tabLabel="Manga" navigation={navigation} screenProps={screenProps} />
        </ScrollableTabView>
      </View>
    );
  }
}

export default Home;

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import RecommendedIllust from './RecommendedIllust';
import RecommendedManga from './RecommendedManga';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

class Home extends Component {
  render() {
    console.log("render home")
    // return (
    //   <View style={styles.container}>
    //     <Text style={styles.welcome}>
    //       Welcome to React Native!
    //     </Text>
    //     <Text style={styles.instructions}>
    //       To get started, edit index.ios.js
    //     </Text>
    //     <Text style={styles.instructions}>
    //       Press Cmd+R to reload,{'\n'}
    //       Cmd+D or shake for dev menu
    //     </Text>
    //   </View>
    // );
    return (
      <View style={styles.container} >
        <ScrollableTabView>
          <RecommendedIllust tabLabel="Illustrations" />
          <RecommendedManga tabLabel="Manga" />
        </ScrollableTabView>
      </View>
    );
  }
}

export default Home;

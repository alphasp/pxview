import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import RankingList from './RankingList';
import { RankingMode } from '../common/actions/ranking';

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

class Ranking extends Component {
  componentDidMount() {
    if (Platform.OS === 'android') {
      setTimeout(() => this.tabs.goToPage(0), 0);
    }
  }
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <ScrollableTabView 
          ref={(ref) => this.tabs = ref} 
          renderTabBar={() => <ScrollableTabBar />}
        >
          <RankingList tabLabel="Daily" rankingMode={RankingMode.DAILY} navigation={navigation} />
          <RankingList tabLabel="Weekly" rankingMode={RankingMode.WEEKLY} navigation={navigation} />
          <RankingList tabLabel="Monthly" rankingMode={RankingMode.MONTHLY} navigation={navigation} />
        </ScrollableTabView>
      </View>
    );
  }
}

export default Ranking;

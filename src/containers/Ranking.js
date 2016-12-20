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
    return (
      <View style={styles.container}>
        <ScrollableTabView ref={(ref) => this.tabs = ref}>
          <RankingList tabLabel="Daily" rankingMode={RankingMode.DAILY} />
          <RankingList tabLabel="Weekly" rankingMode={RankingMode.WEEKLY} />
          <RankingList tabLabel="Monthly" rankingMode={RankingMode.MONTHLY} />
        </ScrollableTabView>
      </View>
    );
  }
}

export default Ranking;

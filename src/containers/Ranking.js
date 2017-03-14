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
import PastRanking from './PastRanking';
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
          <RankingList tabLabel="Daily" rankingMode={RankingMode.DAILY} />
          <RankingList tabLabel="Male" rankingMode={RankingMode.DAILY_MALE} />
          <RankingList tabLabel="Female" rankingMode={RankingMode.DAILY_FEMALE} />
          <RankingList tabLabel="Original" rankingMode={RankingMode.WEEKLY_ORIGINAL} />
          <RankingList tabLabel="Rookie" rankingMode={RankingMode.WEEKLY_ROOKIE} />
          <RankingList tabLabel="Weekly" rankingMode={RankingMode.WEEKLY} />
          <RankingList tabLabel="Monthly" rankingMode={RankingMode.MONTHLY} />
          <PastRanking tabLabel="Past Ranking"  {...this.props} />
        </ScrollableTabView>
      </View>
    );
  }
}

export default Ranking;

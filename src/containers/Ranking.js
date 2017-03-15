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
    const { navigation, screenProps: { strings } } = this.props;
    return (
      <View style={styles.container}>
        <ScrollableTabView 
          ref={(ref) => this.tabs = ref} 
          renderTabBar={() => <ScrollableTabBar />}
        >
          <RankingList tabLabel={strings.day_ranking} rankingMode={RankingMode.DAILY} />
          <RankingList tabLabel={strings.day_male_ranking} rankingMode={RankingMode.DAILY_MALE} />
          <RankingList tabLabel={strings.day_female_ranking} rankingMode={RankingMode.DAILY_FEMALE} />
          <RankingList tabLabel={strings.week_original_ranking} rankingMode={RankingMode.WEEKLY_ORIGINAL} />
          <RankingList tabLabel={strings.week_rookie_ranking} rankingMode={RankingMode.WEEKLY_ROOKIE} />
          <RankingList tabLabel={strings.week_ranking} rankingMode={RankingMode.WEEKLY} />
          <RankingList tabLabel={strings.month_ranking} rankingMode={RankingMode.MONTHLY} />
          <PastRanking tabLabel={strings.past_ranking}  {...this.props} />
        </ScrollableTabView>
      </View>
    );
  }
}

export default Ranking;

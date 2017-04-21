import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { TabBar } from 'react-native-tab-view';
import PXTabView from '../components/PXTabView';
import RankingList from './RankingList';
import PastRanking from './PastRanking';
import { RANKING_FOR_UI } from '../common/constants/rankingTypes';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

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
  tabBar: {
    paddingTop: STATUSBAR_HEIGHT
  }
});

class Ranking extends Component {
  constructor(props) {
    super(props);
    const { screenProps: { strings } } = props;
    this.state = {
      index: 0,
      routes: [
        { key: '1', title: strings.day_ranking },
        { key: '2', title: strings.day_male_ranking },
        { key: '3', title: strings.day_female_ranking },
        { key: '4', title: strings.week_original_ranking },
        { key: '5', title: strings.week_rookie_ranking },
        { key: '6', title: strings.week_ranking },
        { key: '7', title: strings.month_ranking },
        { key: '8', title: strings.past_ranking },
      ],
    }
  }

  handleChangeTab = (index) => {
    this.setState({ index });
  };

  renderScene = ({ route }) => {
    switch (route.key) {
      case '1':
        return <RankingList rankingMode={RANKING_FOR_UI.DAILY} />
      case '2':
        return <RankingList rankingMode={RANKING_FOR_UI.DAILY_MALE} />  
      case '3':
        return <RankingList rankingMode={RANKING_FOR_UI.DAILY_FEMALE} />
      case '4':
        return <RankingList rankingMode={RANKING_FOR_UI.WEEKLY_ORIGINAL} />  
      case '5':
        return <RankingList rankingMode={RANKING_FOR_UI.WEEKLY_ROOKIE} />
      case '6':
        return <RankingList rankingMode={RANKING_FOR_UI.WEEKLY} />  
      case '7':
        return <RankingList rankingMode={RANKING_FOR_UI.MONTHLY} />
      case '8':
        return <PastRanking rankingMode={RANKING_FOR_UI.PAST} screenProps={this.props.screenProps} />       
      default:
        return null;
    };
  }

  renderHeader = (props) => {
    return (
      <TabBar
        style={styles.tabBar}
        {...props}
        scrollEnabled
      />
    );
  };

  render() {
    return (
      <PXTabView
        navigationState={this.state}
        renderScene={this.renderScene}
        onRequestChangeTab={this.handleChangeTab}
        renderHeader={this.renderHeader}
      />
      /*<View style={styles.container}>
        <ScrollableTabView 
          ref={(ref) => this.tabs = ref} 
          renderTabBar={() => <ScrollableTabBar />}
        >
          <RankingList tabLabel={strings.day_ranking} rankingMode={RANKING_FOR_UI.DAILY} />
          <RankingList tabLabel={strings.day_male_ranking} rankingMode={RANKING_FOR_UI.DAILY_MALE} />
          <RankingList tabLabel={strings.day_female_ranking} rankingMode={RANKING_FOR_UI.DAILY_FEMALE} />
          <RankingList tabLabel={strings.week_original_ranking} rankingMode={RANKING_FOR_UI.WEEKLY_ORIGINAL} />
          <RankingList tabLabel={strings.week_rookie_ranking} rankingMode={RANKING_FOR_UI.WEEKLY_ROOKIE} />
          <RankingList tabLabel={strings.week_ranking} rankingMode={RANKING_FOR_UI.WEEKLY} />
          <RankingList tabLabel={strings.month_ranking} rankingMode={RANKING_FOR_UI.MONTHLY} />
          <PastRanking tabLabel={strings.past_ranking}  {...this.props} />
        </ScrollableTabView>
      </View>*/
    );
  }
}

export default Ranking;

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import PXTabView from '../components/PXTabView';
import RankingList from './RankingList';
import PastRanking from './PastRanking';
import { RANKING_FOR_UI } from '../common/constants/rankingTypes';

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
    };
  }

  handleChangeTab = index => {
    this.setState({ index });
  };

  renderScene = ({ route }) => {
    switch (route.key) {
      case '1':
        return <RankingList rankingMode={RANKING_FOR_UI.DAILY} />;
      case '2':
        return <RankingList rankingMode={RANKING_FOR_UI.DAILY_MALE} />;
      case '3':
        return <RankingList rankingMode={RANKING_FOR_UI.DAILY_FEMALE} />;
      case '4':
        return <RankingList rankingMode={RANKING_FOR_UI.WEEKLY_ORIGINAL} />;
      case '5':
        return <RankingList rankingMode={RANKING_FOR_UI.WEEKLY_ROOKIE} />;
      case '6':
        return <RankingList rankingMode={RANKING_FOR_UI.WEEKLY} />;
      case '7':
        return <RankingList rankingMode={RANKING_FOR_UI.MONTHLY} />;
      case '8':
        return <PastRanking rankingMode={RANKING_FOR_UI.PAST} screenProps={this.props.screenProps} />;
      default:
        return null;
    }
  }

  render() {
    return (
      <PXTabView
        navigationState={this.state}
        renderScene={this.renderScene}
        onRequestChangeTab={this.handleChangeTab}
        tabBarProps={{
          scrollEnabled: true,
        }}
        includeStatusBarPadding
      />
    );
  }
}

export default Ranking;

import React, { Component } from 'react';
import RankingList from './RankingList';
import PastRanking from './PastRanking';
import PXTabView from '../../components/PXTabView';
import { connectLocalization } from '../../components/Localization';
import { RANKING_FOR_UI } from '../../common/constants';

class Ranking extends Component {
  constructor(props) {
    super(props);
    const { i18n } = this.props;
    this.state = {
      index: 0,
      routes: [
        { key: '1', title: i18n.day_ranking },
        { key: '2', title: i18n.day_male_ranking },
        { key: '3', title: i18n.day_female_ranking },
        { key: '4', title: i18n.week_original_ranking },
        { key: '5', title: i18n.week_rookie_ranking },
        { key: '6', title: i18n.week_ranking },
        { key: '7', title: i18n.month_ranking },
        { key: '8', title: i18n.past_ranking },
      ],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { i18n: prevI18n } = this.props.i18n;
    const i18n = nextProps.i18n;
    if (i18n !== prevI18n) {
      this.setState({
        routes: [
          { key: '1', title: i18n.day_ranking },
          { key: '2', title: i18n.day_male_ranking },
          { key: '3', title: i18n.day_female_ranking },
          { key: '4', title: i18n.week_original_ranking },
          { key: '5', title: i18n.week_rookie_ranking },
          { key: '6', title: i18n.week_ranking },
          { key: '7', title: i18n.month_ranking },
          { key: '8', title: i18n.past_ranking },
        ],
      });
    }
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
        return (
          <PastRanking
            rankingMode={RANKING_FOR_UI.PAST}
            screenProps={this.props.screenProps}
          />
        );
      default:
        return null;
    }
  };

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

export default connectLocalization(Ranking);

import React, { Component } from 'react';
import RankingList from './RankingList';
import PastRanking from './PastRanking';
import PXTabView from '../../components/PXTabView';
import TabContentWrapper from '../../components/TabContentWrapper';
import { connectLocalization } from '../../components/Localization';
import { RANKING_FOR_UI } from '../../common/constants';

class Ranking extends Component {
  constructor(props) {
    super(props);
    const { i18n } = this.props;
    this.state = {
      index: 0,
      routes: [
        { key: '1', title: i18n.rankingDay },
        { key: '2', title: i18n.rankingDayMale },
        { key: '3', title: i18n.rankingDayFemale },
        { key: '4', title: i18n.rankingWeekOriginal },
        { key: '5', title: i18n.rankingWeekRookie },
        { key: '6', title: i18n.rankingWeek },
        { key: '7', title: i18n.rankingMonth },
        { key: '8', title: i18n.rankingPast },
      ],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { lang: prevLang } = this.props;
    const { lang, i18n } = nextProps;
    if (lang !== prevLang) {
      this.setState({
        routes: [
          { key: '1', title: i18n.rankingDay },
          { key: '2', title: i18n.rankingDayMale },
          { key: '3', title: i18n.rankingDayFemale },
          { key: '4', title: i18n.rankingWeekOriginal },
          { key: '5', title: i18n.rankingWeekRookie },
          { key: '6', title: i18n.rankingWeek },
          { key: '7', title: i18n.rankingMonth },
          { key: '8', title: i18n.rankingPast },
        ],
      });
    }
  }

  handleChangeTab = index => {
    this.setState({ index });
  };

  renderScene = ({ route, index }) => {
    // if (Math.abs(this.state.index - this.state.routes.indexOf(route)) > 2) {
    //   return null;
    // }
    const { navigation } = this.props;
    switch (route.key) {
      case '1':
        return (
          <TabContentWrapper active={index === this.state.index}>
            <RankingList
              rankingMode={RANKING_FOR_UI.DAILY}
              navigation={navigation}
            />
          </TabContentWrapper>
        );
      case '2':
        return (
          <TabContentWrapper active={index === this.state.index}>
            <RankingList
              rankingMode={RANKING_FOR_UI.DAILY_MALE}
              navigation={navigation}
            />
          </TabContentWrapper>
        );
      case '3':
        return (
          <TabContentWrapper active={index === this.state.index}>
            <RankingList
              rankingMode={RANKING_FOR_UI.DAILY_FEMALE}
              navigation={navigation}
            />
          </TabContentWrapper>
        );
      case '4':
        return (
          <TabContentWrapper active={index === this.state.index}>
            <RankingList
              rankingMode={RANKING_FOR_UI.WEEKLY_ORIGINAL}
              navigation={navigation}
            />
          </TabContentWrapper>
        );
      case '5':
        return (
          <TabContentWrapper active={index === this.state.index}>
            <RankingList
              rankingMode={RANKING_FOR_UI.WEEKLY_ROOKIE}
              navigation={navigation}
            />
          </TabContentWrapper>
        );
      case '6':
        return (
          <TabContentWrapper active={index === this.state.index}>
            <RankingList
              rankingMode={RANKING_FOR_UI.WEEKLY}
              navigation={navigation}
            />
          </TabContentWrapper>
        );
      case '7':
        return (
          <TabContentWrapper active={index === this.state.index}>
            <RankingList
              rankingMode={RANKING_FOR_UI.MONTHLY}
              navigation={navigation}
            />
          </TabContentWrapper>
        );
      case '8':
        return (
          <TabContentWrapper active={index === this.state.index}>
            <PastRanking
              rankingMode={RANKING_FOR_UI.PAST}
              navigation={navigation}
            />
          </TabContentWrapper>
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

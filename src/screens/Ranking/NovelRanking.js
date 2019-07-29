import React, { Component } from 'react';
import NovelRankingList from './NovelRankingList';
import PastRanking from './PastRanking';
import PXTabView from '../../components/PXTabView';
import TabContentWrapper from '../../components/TabContentWrapper';
import { connectLocalization } from '../../components/Localization';
import { RANKING_FOR_UI } from '../../common/constants';
import config from '../../common/config';

class NovelRanking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: this.getRoutes(),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { lang: prevLang } = this.props;
    const { lang } = nextProps;
    if (lang !== prevLang) {
      this.setState({
        routes: this.getRoutes(),
      });
    }
  }

  getRoutes = () => {
    const { i18n } = this.props;
    // always return new array so that localized title will be updated on switch language
    return [
      {
        key: '1',
        title: i18n.rankingDay,
        rankingMode: RANKING_FOR_UI.DAILY_NOVEL,
        reload: false,
      },
      {
        key: '2',
        title: i18n.rankingDayMale,
        rankingMode: RANKING_FOR_UI.DAILY_MALE_NOVEL,
      },
      {
        key: '3',
        title: i18n.rankingDayFemale,
        rankingMode: RANKING_FOR_UI.DAILY_FEMALE_NOVEL,
      },
      {
        key: '4',
        title: i18n.rankingWeekRookie,
        rankingMode: RANKING_FOR_UI.WEEKLY_ROOKIE_NOVEL,
      },
      {
        key: '5',
        title: i18n.rankingWeek,
        rankingMode: RANKING_FOR_UI.WEEKLY_NOVEL,
      },
      {
        key: '6',
        title: i18n.rankingPast,
        rankingMode: RANKING_FOR_UI.PAST_NOVEL,
      },
    ];
  };

  handleChangeTab = index => {
    this.setState({ index });
  };

  renderScene = ({ index }) => {
    const { navigation } = this.props;
    const { rankingType } = navigation.state.params;
    const { rankingMode, reload } = this.state.routes[index];
    return (
      <TabContentWrapper active={index === this.state.index}>
        {rankingMode === RANKING_FOR_UI.PAST_NOVEL ? (
          <PastRanking
            rankingType={rankingType}
            rankingMode={rankingMode}
            navigation={navigation}
          />
        ) : (
          <NovelRankingList
            rankingMode={rankingMode}
            navigation={navigation}
            reload={reload}
          />
        )}
      </TabContentWrapper>
    );
  };

  render() {
    return (
      <PXTabView
        navigationState={this.state}
        renderScene={this.renderScene}
        onIndexChange={this.handleChangeTab}
        tabBarProps={{
          scrollEnabled: true,
        }}
        includeStatusBarPadding={config.navigation.tab}
      />
    );
  }
}

export default connectLocalization(NovelRanking);

import React, { Component } from 'react';
import NovelRankingList from './NovelRankingList';
import PastRanking from './PastRanking';
import PXTabView from '../../components/PXTabView';
import TabContentWrapper from '../../components/TabContentWrapper';
import { connectLocalization } from '../../components/Localization';
import { RANKING_FOR_UI } from '../../common/constants';
import config from '../../common/config';
import mapRankingTypeString from '../../common/helpers/mapRankingTypeString';

class NovelRanking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: this.getRoutes(),
    };
  }

  componentDidMount() {
    const { navigation, route, i18n } = this.props;
    navigation.setOptions({
      title: `${mapRankingTypeString(route.params?.rankingType, i18n)} ${
        i18n.ranking
      }`,
    });
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

  handleChangeTab = (index) => {
    this.setState({ index });
  };

  renderScene = ({ route }) => {
    const { route: navigationRoute } = this.props;
    const { routes, index } = this.state;
    const { rankingType } = navigationRoute.params;
    const { rankingMode, reload } = route;
    return (
      <TabContentWrapper active={routes.indexOf(route) === index}>
        {rankingMode === RANKING_FOR_UI.PAST_NOVEL ? (
          <PastRanking
            rankingType={rankingType}
            rankingMode={rankingMode}
            route={route}
          />
        ) : (
          <NovelRankingList
            rankingMode={rankingMode}
            route={route}
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
        scrollEnabled
        includeStatusBarPadding={config.navigation.tab}
      />
    );
  }
}

export default connectLocalization(NovelRanking);

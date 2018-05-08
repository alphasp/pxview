import React from 'react';
import { createStackNavigator } from 'react-navigation';
import RankingPreview from '../screens/Ranking/RankingPreview';
import Ranking from '../screens/Ranking/Ranking';
import NovelRanking from '../screens/Ranking/NovelRanking';
import enhanceRouter from './routers/enhanceRouter';
import DrawerMenuButton from '../components/DrawerMenuButton';
import DrawerIcon from '../components/DrawerIcon';
import { globalStyles, globalStyleVariables } from '../styles';
import config from '../common/config';
import { SCREENS, RANKING_TYPES } from '../common/constants';

const mapRankingTypeString = (rankingType, i18n) => {
  switch (rankingType) {
    case RANKING_TYPES.ILLUST:
      return i18n.illustration;
    case RANKING_TYPES.MANGA:
      return i18n.manga;
    case RANKING_TYPES.NOVEL:
      return i18n.novel;
    default:
      return '';
  }
};

const routeConfig = {
  [SCREENS.RankingPreview]: {
    screen: RankingPreview,
    navigationOptions: config.navigation.tab
      ? { header: null }
      : ({ navigation, screenProps: { i18n } }) => ({
          title: i18n.ranking,
          headerLeft: (
            <DrawerMenuButton onPress={() => navigation.openDrawer()} />
          ),
        }),
  },
  [SCREENS.Ranking]: {
    screen: Ranking,
    navigationOptions: ({ screenProps: { i18n }, navigation }) => ({
      title: `${mapRankingTypeString(
        navigation.state.params.rankingType,
        i18n,
      )} ${i18n.ranking}`,
    }),
  },
  [SCREENS.NovelRanking]: {
    screen: NovelRanking,
    navigationOptions: ({ screenProps: { i18n }, navigation }) => ({
      title: `${mapRankingTypeString(
        navigation.state.params.rankingType,
        i18n,
      )} ${i18n.ranking}`,
    }),
  },
};

const stackConfig = {
  navigationOptions: {
    headerStyle: config.navigation.tab
      ? globalStyles.header
      : globalStyles.headerWithoutShadow,
    headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
    headerBackTitle: null,
  },
  cardStyle: globalStyles.card,
  headerMode: 'screen',
};

const RankingNavigator = createStackNavigator(routeConfig, stackConfig);

if (!config.navigation.tab) {
  RankingNavigator.navigationOptions = ({ screenProps: { i18n } }) => ({
    drawerLabel: i18n.ranking,
    drawerIcon: ({ tintColor }) =>
      <DrawerIcon name="trophy" color={tintColor} />,
  });
}

export default enhanceRouter(RankingNavigator);

import { createDrawerNavigator } from 'react-navigation';
import RecommendedNavigator from './RecommendedNavigator';
import RankingNavigator from './RankingNavigator';
import TrendingNavigator from './TrendingNavigator';
import NewWorksNavigator from './NewWorksNavigator';
import DrawerContent from '../components/DrawerContent';
import { globalStyles, globalStyleVariables } from '../styles';
import { SCREENS } from '../common/constants';

const createAppDrawerNavigator = ({ initialRouteName }) =>
  createDrawerNavigator(
    {
      [SCREENS.Recommended]: {
        screen: RecommendedNavigator,
      },
      [SCREENS.Ranking]: {
        screen: RankingNavigator,
      },
      [SCREENS.Trending]: {
        screen: TrendingNavigator,
      },
      [SCREENS.NewWorks]: {
        screen: NewWorksNavigator,
      },
    },
    {
      defaultNavigationOptions: {
        headerStyle: globalStyles.header,
        headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
      },
      unmountInactiveRoutes: true,
      initialRouteName,
      cardStyle: globalStyles.card,
      contentComponent: DrawerContent,
    },
  );

export default createAppDrawerNavigator;

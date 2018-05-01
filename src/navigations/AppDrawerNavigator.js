import { DrawerNavigator } from 'react-navigation';
import RecommendedNavigator from './RecommendedNavigator';
import RankingNavigator from './RankingNavigator';
import TrendingNavigator from './TrendingNavigator';
import NewWorksNavigator from './NewWorksNavigator';
import DrawerContent from '../components/DrawerContent';
import { globalStyles, globalStyleVariables } from '../styles';
import { SCREENS } from '../common/constants';

const createAppDrawerNavigator = ({ initialRouteName }) =>
  DrawerNavigator(
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
      navigationOptions: {
        headerStyle: globalStyles.header,
        headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
      },
      initialRouteName,
      cardStyle: globalStyles.card,
      contentComponent: DrawerContent,
    },
  );

export default createAppDrawerNavigator;

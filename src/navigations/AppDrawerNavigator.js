import { DrawerNavigator } from 'react-navigation';
import HomeNavigator from './HomeNavigator';
import RankingNavigator from './RankingNavigator';
import TrendingNavigator from './TrendingNavigator';
import NewWorksNavigator from './NewWorksNavigator';
import DrawerContent from '../components/DrawerContent';
import { globalStyles, globalStyleVariables } from '../styles';
import { SCREENS } from '../common/constants';

const AppDrawerNavigator = DrawerNavigator(
  {
    [SCREENS.Home]: {
      screen: HomeNavigator,
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
      headerStyle: {
        backgroundColor: globalStyleVariables.HEADER_BACKGROUND_COLOR,
      },
      headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
    },
    cardStyle: globalStyles.card,
    contentComponent: DrawerContent,
  },
);

export default AppDrawerNavigator;

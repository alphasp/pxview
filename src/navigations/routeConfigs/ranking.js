import Ranking from '../../screens/Ranking/Ranking';
import { SCREENS } from '../../common/constants';

const config = {
  [SCREENS.Ranking]: {
    screen: Ranking,
    navigationOptions: {
      header: null,
    },
  },
};

export default config;

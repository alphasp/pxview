import Recommended from '../../screens/Recommended/Recommended';
import { SCREENS } from '../../common/constants';

const config = {
  [SCREENS.Recommended]: {
    screen: Recommended,
    navigationOptions: {
      header: null,
    },
  },
};

export default config;

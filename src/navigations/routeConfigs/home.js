import Home from '../../screens/Home/Home';
import { SCREENS } from '../../common/constants';

const config = {
  [SCREENS.Home]: {
    screen: Home,
    navigationOptions: {
      header: null,
    },
  },
};

export default config;

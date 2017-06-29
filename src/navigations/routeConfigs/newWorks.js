import NewWorks from '../../screens/NewWorks/NewWorks';
import { SCREENS } from '../../common/constants';

const config = {
  [SCREENS.NewWorks]: {
    screen: NewWorks,
    navigationOptions: {
      header: null,
    },
  },
};

export default config;

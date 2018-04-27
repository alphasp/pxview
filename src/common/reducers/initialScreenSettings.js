import { INITIAL_SCREEN_SETTINGS } from '../constants/actionTypes';
import { SCREENS } from '../constants';

const initState = {
  routeName: SCREENS.Recommended,
};

export default function initialScreenSettings(state = initState, action) {
  switch (action.type) {
    case INITIAL_SCREEN_SETTINGS.SET:
      return {
        ...state,
        routeName: action.payload.routeName,
      };
    default:
      return state;
  }
}

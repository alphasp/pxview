import { THEME } from '../constants/actionTypes';
import { THEME_TYPES } from '../constants';

const initState = {
  name: THEME_TYPES.LIGHT,
};

export default function theme(state = initState, action) {
  switch (action.type) {
    case THEME.SET:
      return {
        ...state,
        name: action.payload.name,
      };
    case THEME.RESTORE:
      return {
        ...state,
        ...action.payload.state,
      };
    default:
      return state;
  }
}

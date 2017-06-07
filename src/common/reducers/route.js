import { ROUTE } from '../constants/actionTypes';

export default function i18n(
  state = {
    route: {},
  },
  action,
) {
  switch (action.type) {
    case ROUTE.SET:
      return {
        ...state,
        route: action.payload.route,
      };
    default:
      return state;
  }
}

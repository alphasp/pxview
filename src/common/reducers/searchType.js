import { SEARCH_TYPE } from '../constants/actionTypes';
import { SEARCH_TYPES } from '../constants';

export default function searchType(
  state = {
    type: SEARCH_TYPES.ILLUST,
  },
  action = {},
) {
  switch (action.type) {
    case SEARCH_TYPE.SET:
      return {
        ...state,
        type: action.payload.type,
      };
    default:
      return state;
  }
}

import { USER_FOLLOW_DETAIL } from '../constants/actionTypes';

const defaultState = {
  loading: false,
  loaded: false,
};
export default function userFollowDetail(state = defaultState, action) {
  switch (action.type) {
    case USER_FOLLOW_DETAIL.CLEAR:
      return defaultState;
    case USER_FOLLOW_DETAIL.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case USER_FOLLOW_DETAIL.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        item: action.payload.item,
        timestamp: action.payload.timestamp,
      };
    case USER_FOLLOW_DETAIL.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
      };
    default:
      return state;
  }
}

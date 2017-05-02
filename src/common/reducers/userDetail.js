import { USER_DETAIL } from '../constants/actionTypes';

// const defaultState = {
//   loading: false,
//   loaded: false,
//   refreshing: false,
//   item: [],
// };
export default function userDetail(state = {}, action) {
  switch (action.type) {
    case USER_DETAIL.CLEAR:
      return {
        ...state,
        [action.payload.userId]: {},
      };
    case USER_DETAIL.CLEAR_ALL:
      return {};
    case USER_DETAIL.REQUEST:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: true,
          refreshing: action.payload.refreshing,
        },
      };
    case USER_DETAIL.SUCCESS:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: false,
          loaded: true,
          refreshing: false,
          item: action.payload.item,
          timestamp: action.payload.timestamp,
        },
      };
    case USER_DETAIL.FAILURE:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: false,
          loaded: true,
          refreshing: false,
        },
      };
    default:
      return state;
  }
}

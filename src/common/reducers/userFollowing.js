import { USER_FOLLOWING } from '../constants/actionTypes';
import { FOLLOWING_TYPES } from '../constants';

const defaultStateByUserFollowingType = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
  offset: 0,
  nextUrl: null,
};

export default function userFollowing(
  state = {
    [FOLLOWING_TYPES.PUBLIC]: {},
    [FOLLOWING_TYPES.PRIVATE]: {},
  },
  action,
) {
  switch (action.type) {
    case USER_FOLLOWING.CLEAR:
      return {
        ...state,
        [action.payload.followingType]: {
          [action.payload.userId]: defaultStateByUserFollowingType,
        },
      };
    case USER_FOLLOWING.CLEAR_ALL:
      return {
        ...state,
        [FOLLOWING_TYPES.PUBLIC]: {},
        [FOLLOWING_TYPES.PRIVATE]: {},
      };
    case USER_FOLLOWING.REQUEST:
      return {
        ...state,
        [action.payload.followingType]: {
          [action.payload.userId]: {
            ...state[action.payload.followingType][action.payload.userId],
            loading: true,
            refreshing: action.payload.refreshing,
          },
        },
      };
    case USER_FOLLOWING.SUCCESS:
      return {
        ...state,
        [action.payload.followingType]: {
          [action.payload.userId]: {
            loading: false,
            loaded: true,
            refreshing: false,
            items: state[action.payload.followingType][action.payload.userId] &&
              state[action.payload.followingType][action.payload.userId].items
              ? [
                  ...state[action.payload.followingType][action.payload.userId]
                    .items,
                  ...action.payload.items,
                ]
              : action.payload.items,
            offset: action.payload.offset,
            nextUrl: action.payload.nextUrl,
            timestamp: action.payload.timestamp,
          },
        },
      };
    case USER_FOLLOWING.FAILURE:
      return {
        ...state,
        [action.payload.followingType]: {
          [action.payload.userId]: {
            ...state[action.payload.followingType][action.payload.userId],
            loading: false,
            loaded: true,
            refreshing: false,
          },
        },
      };
    default:
      return state;
  }
}

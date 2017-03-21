import { 
  FETCH_USER_FOLLOWING_REQUEST, 
  FETCH_USER_FOLLOWING_SUCCESS, 
  FETCH_USER_FOLLOWING_FAILURE, 
  CLEAR_USER_FOLLOWING,
  CLEAR_ALL_USER_FOLLOWING,
  FollowingType
} from '../actions/userFollowing';

const defaultStateByUserFollowingType = {
  loading: false,
  loaded: false,
  items: [],
  offset: 0,
  nextUrl: null,
};

export default function userFollowing(state = {
  [FollowingType.PUBLIC]: {},
  [FollowingType.PRIVATE]: {}
}, action) {
  switch (action.type) {
    case CLEAR_USER_FOLLOWING:
      return {
        ...state,
        [action.payload.followingType]: {
          [action.payload.userId]: defaultStateByUserFollowingType
        }
      };
    case CLEAR_ALL_USER_FOLLOWING:
      return {
        ...state,
        [FollowingType.PUBLIC]: {},
        [FollowingType.PRIVATE]: {}
      };
    case FETCH_USER_FOLLOWING_REQUEST:
      return {
        ...state,
        [action.payload.followingType]: {
          [action.payload.userId]: {
            ...state[action.payload.followingType][action.payload.userId],
            loading: true
          }
        }
      };
    case FETCH_USER_FOLLOWING_SUCCESS:
      return {
        ...state,
        [action.payload.followingType]: {
          [action.payload.userId]: {
            loading: false,
            loaded: true,
            items: (state[action.payload.followingType][action.payload.userId] && state[action.payload.followingType][action.payload.userId].items) ? [...state[action.payload.followingType][action.payload.userId].items, ...action.payload.items] : action.payload.items,
            offset: action.payload.offset,
            nextUrl: action.payload.nextUrl,
            lastUpdated: action.payload.receivedAt,
          }
        }
      };
    case FETCH_USER_FOLLOWING_FAILURE:
      return {
        ...state,
        [action.payload.followingType]: {
          [action.payload.userId]: {
            ...state[action.payload.followingType][action.payload.userId],
            loading: false
          }
        }
      };
    default:
      return state;
  }
}
import { 
  FETCH_USER_FOLLOWER_REQUEST, 
  FETCH_USER_FOLLOWER_SUCCESS, 
  FETCH_USER_FOLLOWER_FAILURE, 
  CLEAR_USER_FOLLOWER,
  CLEAR_ALL_USER_FOLLOWER,
  FollowerType
} from '../actions/userFollowers';

export default function userFollowers(state = {}, action) {
  switch (action.type) {
    case CLEAR_USER_FOLLOWER:
      return {
        ...state,
        [action.payload.userId]: {},
      };
    case CLEAR_ALL_USER_FOLLOWER:
      return {};
    case FETCH_USER_FOLLOWER_REQUEST:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: true
        }
      };
    case FETCH_USER_FOLLOWER_SUCCESS:
      return {
        ...state,
        [action.payload.userId]: {
          loading: false,
          loaded: true,
          items: (state[action.payload.userId] && state[action.payload.userId].items) ? [...state[action.payload.userId].items, ...action.payload.items] : action.payload.items,
          offset: action.payload.offset,
          nextUrl: action.payload.nextUrl,
          timestamp: action.payload.timestamp,
        }
      };
    case FETCH_USER_FOLLOWER_FAILURE:
      return {
        ...state,
        [action.payload.userId]: {
          loading: false
        }
      };
    default:
      return state;
  }
}
import { 
  FETCH_USER_MY_PIXIV_REQUEST, 
  FETCH_USER_MY_PIXIV_SUCCESS, 
  FETCH_USER_MY_PIXIV_FAILURE, 
  CLEAR_USER_MY_PIXIV,
  CLEAR_ALL_USER_MY_PIXIV,
  FollowerType
} from '../actions/userMyPixiv';

export default function userMyPixiv(state = {}, action) {
  switch (action.type) {
    case CLEAR_USER_MY_PIXIV:
      return {
        ...state,
        [action.payload.userId]: {},
      };
    case CLEAR_ALL_USER_MY_PIXIV:
      return {};
    case FETCH_USER_MY_PIXIV_REQUEST:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: true
        }
      };
    case FETCH_USER_MY_PIXIV_SUCCESS:
      return {
        ...state,
        [action.payload.userId]: {
          loading: false,
          loaded: true,
          items: (state[action.payload.userId] && state[action.payload.userId].items) ? [...state[action.payload.userId].items, ...action.payload.items] : action.payload.items,
          offset: action.payload.offset,
          nextUrl: action.payload.nextUrl,
          lastUpdated: action.payload.receivedAt,
        }
      };
    case FETCH_USER_MY_PIXIV_FAILURE:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: false
        }
      };
    default:
      return state;
  }
}
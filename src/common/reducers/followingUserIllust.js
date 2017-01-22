import { 
  REQUEST_FOLLOWING_USER_ILLUSTS, 
  RECEIVE_FOLLOWING_USER_ILLUSTS, 
  STOP_FOLLOWING_USER_ILLUSTS, 
  CLEAR_FOLLOWING_USER_ILLUSTS,
} from "../actions/followingUserIllust";

export default function followingUserIllust(state = {
  loading: false,
  loaded: false,
  items: [],
  offset: 0,
  nextUrl: null,
}, action) {
  switch (action.type) {
    case CLEAR_FOLLOWING_USER_ILLUSTS:
      return {
        ...state,
        loading: false,
        loaded: false,
        items: [],
        offset: 0,
        nextUrl: null,
      };
    case REQUEST_FOLLOWING_USER_ILLUSTS:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_FOLLOWING_USER_ILLUSTS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...state.items, ...action.payload.items],
        offset: action.payload.offset,
        nextUrl: action.payload.nextUrl,
        lastUpdated: action.payload.receivedAt,
      };
    case STOP_FOLLOWING_USER_ILLUSTS:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
import { 
  REQUEST_MY_PRIVATE_BOOKMARK_ILLUSTS, 
  RECEIVE_MY_PRIVATE_BOOKMARK_ILLUSTS,
  STOP_MY_PRIVATE_BOOKMARK_ILLUSTS, 
  CLEAR_MY_PRIVATE_BOOKMARK_ILLUSTS,
} from "../actions/myPrivateBookmarkIllust";

export default function userIllust(state = {
  loading: false,
  loaded: false,
  items: [],
  offset: 0,
  nextUrl: null,
}, action) {
  switch (action.type) {
    case CLEAR_MY_PRIVATE_BOOKMARK_ILLUSTS:
      return {
        ...state,
        loading: false,
        loaded: false,
        items: [],
        offset: 0,
        nextUrl: null,
      };
    case REQUEST_MY_PRIVATE_BOOKMARK_ILLUSTS:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_MY_PRIVATE_BOOKMARK_ILLUSTS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...state.items, ...action.payload.items],
        offset: action.payload.offset,
        nextUrl: action.payload.nextUrl,
        lastUpdated: action.payload.receivedAt,
      };
    case STOP_MY_PRIVATE_BOOKMARK_ILLUSTS:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
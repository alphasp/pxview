import { 
  REQUEST_NEW_ILLUSTS, 
  RECEIVE_NEW_ILLUSTS, 
  STOP_NEW_ILLUSTS, 
  CLEAR_NEW_ILLUSTS,
} from "../actions/newIllust";

export default function followingUserIllust(state = {
  loading: false,
  loaded: false,
  items: [],
  offset: 0,
  nextUrl: null,
}, action) {
  switch (action.type) {
    case CLEAR_NEW_ILLUSTS:
      return {
        ...state,
        loading: false,
        loaded: false,
        items: [],
        offset: 0,
        nextUrl: null,
      };
    case REQUEST_NEW_ILLUSTS:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_NEW_ILLUSTS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...state.items, ...action.payload.items],
        offset: action.payload.offset,
        nextUrl: action.payload.nextUrl,
        lastUpdated: action.payload.receivedAt,
      };
    case STOP_NEW_ILLUSTS:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
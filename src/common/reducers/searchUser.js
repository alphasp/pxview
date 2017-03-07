import { 
  REQUEST_SEARCH_USER, 
  RECEIVE_SEARCH_USER,
  RECEIVE_SEARCH_USER_CONCAT,
  STOP_SEARCH_USER, 
  CLEAR_SEARCH_USER,
} from "../actions/searchUser";
import { 
  FOLLOW_USER, 
  UNFOLLOW_USER,
} from "../actions/followUser";

export default function searchUser(state = {
  loading: false,
  loaded: false,
  items: [],
  nextUrl: null,
}, action) {
  switch (action.type) {
    case CLEAR_SEARCH_USER:
      return {
        ...state,
        loading: false,
        loaded: false,
        items: [],
        nextUrl: null,
      };
    case REQUEST_SEARCH_USER:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_SEARCH_USER:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...action.payload.items],
        nextUrl: action.payload.nextUrl,
        lastUpdated: action.payload.receivedAt,
      };
    case RECEIVE_SEARCH_USER_CONCAT:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...state.items, ...action.payload.items],
        nextUrl: action.payload.nextUrl,
        lastUpdated: action.payload.receivedAt,
      };
    case STOP_SEARCH_USER:
      return {
        ...state,
        loading: false,
      };
    case FOLLOW_USER:
      return {
        ...state,
        items: state.items.map(item =>
          item.user && item.user.id === action.payload.userId ?
          { 
            ...item, 
            user: {
              ...item.user,
              is_followed: true 
            }
          } 
          :
          item
        )
      }
    case UNFOLLOW_USER:
      return {
        ...state,
        items: state.items.map(item =>
          item.user && item.user.id === action.payload.userId ?
          { 
            ...item, 
            user: {
              ...item.user,
              is_followed: false 
            }
          } 
          :
          item
        )
      }
    default:
      return state;
  }
}
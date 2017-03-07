import { 
  REQUEST_RECOMMENDED_USERS, 
  RECEIVE_RECOMMENDED_USERS,
  STOP_RECOMMENDED_USERS, 
  CLEAR_RECOMMENDED_USERS,
} from "../actions/recommendedUser";
import { 
  FOLLOW_USER, 
  UNFOLLOW_USER,
} from "../actions/followUser";

export function recommendedUser(state = {
  loading: false,
  loaded: false,
  items: [],
  offset: 0,
  nextUrl: null,
}, action) {
  switch (action.type) {
    case CLEAR_RECOMMENDED_USERS:
      return {
        ...state,
        loading: false,
        loaded: false,
        items: [],
        offset: 0,
        nextUrl: null,
      };
    case REQUEST_RECOMMENDED_USERS:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_RECOMMENDED_USERS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...state.items, ...action.payload.items],
        offset: action.payload.offset,
        nextUrl: action.payload.nextUrl,
        lastUpdated: action.payload.receivedAt,
      };
    case STOP_RECOMMENDED_USERS:
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
            },
            illusts: item.illusts.map(illust =>
              illust.user && illust.user.id === action.payload.userId ?
              { 
                ...illust, 
                user: {
                  ...illust.user,
                  is_followed: true 
                }
              } 
              :
              item
            )
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
            },
            illusts: item.illusts.map(illust =>
              illust.user && illust.user.id === action.payload.userId ?
              { 
                ...illust, 
                user: {
                  ...illust.user,
                  is_followed: false 
                }
              } 
              :
              item
            )
          } 
          :
          item
        )
      }
    default:
      return state;
  }
}
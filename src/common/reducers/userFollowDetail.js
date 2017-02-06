import { 
  FETCH_USER_FOLLOW_DETAIL_REQUEST, 
  FETCH_USER_FOLLOW_DETAIL_SUCCESS, 
  FETCH_USER_FOLLOW_DETAIL_FAILURE, 
  CLEAR_USER_FOLLOW_DETAIL,
} from '../actions/userFollowDetail';

export default function userFollowDetail(state = {
  loading: false,
  loaded: false,
  item: null,
  userId: null,
}, action) {
  switch (action.type) {
    case CLEAR_USER_FOLLOW_DETAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        item: null,
        userId: null,
      };
    case FETCH_USER_FOLLOW_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        userId: action.payload.userId
      };
    case FETCH_USER_FOLLOW_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        item: action.payload.item,
        userId: action.payload.userId,
        lastUpdated: action.payload.receivedAt,
      };
    case FETCH_USER_FOLLOW_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        userId: action.payload.userId,
      };
    default:
      return state;
  }
}
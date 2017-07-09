import { FOLLOW_USER, UNFOLLOW_USER } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
};

// unused
export default function followUser(state = initState, action) {
  switch (action.type) {
    case FOLLOW_USER.REQUEST:
    case UNFOLLOW_USER.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FOLLOW_USER.SUCCESS:
    case UNFOLLOW_USER.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        timestamp: action.payload.timestamp,
      };
    case FOLLOW_USER.FAILURE:
    case UNFOLLOW_USER.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
      };
    default:
      return state;
  }
}

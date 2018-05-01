import { REHYDRATE } from 'redux-persist';
import {
  AUTH_LOGIN,
  AUTH_SIGNUP,
  AUTH_LOGOUT,
  AUTH_REFRESH_ACCESS_TOKEN,
  AUTH_REHYDRATE,
} from '../constants/actionTypes';

export default function auth(
  state = {
    loading: false,
    loaded: false,
    user: null,
    rehydrated: false,
  },
  action,
) {
  switch (action.type) {
    case AUTH_LOGOUT.SUCCESS:
      return {
        ...state,
        user: null,
        loaded: false,
      };
    case AUTH_LOGIN.REQUEST:
    case AUTH_SIGNUP.REQUEST:
    case AUTH_REFRESH_ACCESS_TOKEN.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case AUTH_LOGIN.SUCCESS:
    case AUTH_REFRESH_ACCESS_TOKEN.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.payload.user,
        timestamp: action.payload.timestamp,
      };
    case AUTH_LOGIN.FAILURE:
    case AUTH_SIGNUP.FAILURE:
    case AUTH_REFRESH_ACCESS_TOKEN.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
      };
    case REHYDRATE:
      return {
        ...state,
        ...(action.payload && action.payload.auth),
        rehydrated: false,
      };
    case AUTH_REHYDRATE.SUCCESS:
      return {
        ...state,
        rehydrated: true,
      };
    default:
      return state;
  }
}

import { REHYDRATE } from 'redux-persist/constants';
import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT,
  AUTH_REHYDRATE_DONE,
} from '../actions/auth';
// const defaultUser = {
//   "profile_image_urls": {
//     "px_16x16": "https://source.pixiv.net/common/images/no_profile_ss.png",
//     "px_50x50": "https://source.pixiv.net/common/images/no_profile_s.png",
//     "px_170x170": "https://source.pixiv.net/common/images/no_profile.png"
//   },
//   "id": "17944295",
//   "name": "mysticmana",
//   "account": "mysticmana",
//   "mail_address": "mysticmana@gmail.com",
//   "is_premium": false,
//   "x_restrict": 2,
//   "is_mail_authorized": true,
//   accessToken: "jfkafjlaf",
//   refreshToken: "",
//   expiresIn: 3600,
// }
export default function auth(state = {
  loading: false,
  loaded: false,
  user: null,
  rehydrated: false,
}, action) {
  switch (action.type) {
    case LOGOUT:
      return {
        ...state,
        user: null,
        loaded: false,
      };
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.payload.user,
        timestamp: action.payload.timestamp,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
      };
    case REHYDRATE:
      return {
        ...state,
        ...action.payload.auth,
        rehydrated: false,
      };
    case AUTH_REHYDRATE_DONE:
      return {
        ...state,
        rehydrated: true,
      };
    default:
      return state;
  }
}

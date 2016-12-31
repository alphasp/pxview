import { 
  REQUEST_LOGIN, SUCCESS_LOGIN, FAILED_LOGIN, LOGOUT,
  REQUEST_REFRESH_TOKEN, SUCCESS_REFRESH_TOKEN, FAILED_REFRESH_TOKEN
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
}, action) {
  switch (action.type) {
    case LOGOUT:
      return {
        ...state,
        user: null,
        loaded: false,
      }
    case REQUEST_LOGIN:
      return {
        ...state,
        loading: true,
      };
    case SUCCESS_LOGIN:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.payload.user,
        lastUpdated: action.payload.receivedAt,
      };
    case FAILED_LOGIN:
      return {
        ...state,
        loading: false,
      };
    case REQUEST_REFRESH_TOKEN:
      return {
        ...state,
        refreshTokenPromise: action.payload.refreshTokenPromise,
      };
    case SUCCESS_REFRESH_TOKEN:
      return {
        ...state,
        user: action.payload.user,
        lastUpdated: Date.now(),
        refreshTokenPromise: null,
        //refreshTokenPromise: Promise.resolve(),
      }
    case FAILED_REFRESH_TOKEN: 
      return {
        ...state,
        user: null,
        lastUpdated: Date.now(),
        refreshTokenPromise: null,
        //refreshTokenPromise: Promise.resolve(),
      }
    default:
      return state;
  }
}
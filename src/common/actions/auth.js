// import jwtDecode from "jwt-decode";
// import { push } from 'react-router-redux'
import * as Keychain from 'react-native-keychain';
import { addError, resetError } from './error';
import pixiv from '../helpers/ApiClient';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';
export const AUTH_REHYDRATE_DONE = 'AUTH_REHYDRATE_DONE';

// const defaultUser = {
//   "access_token": "-L9fVk2G8esw5Oqx7W7URMUgHx5S1SwNjrDOKlnPXBM",
//   "expires_in": 3600,
//   "token_type": "bearer",
//   "scope": "unlimited",
//   "refresh_token": "jDS72HEvnwlRypILeIu46-WRs9cw1C6-p11tf89SegM",
//   "user": {
//     "profile_image_urls": {
//       "px_16x16": "https://source.pixiv.net/common/images/no_profile_ss.png",
//       "px_50x50": "https://source.pixiv.net/common/images/no_profile_s.png",
//       "px_170x170": "https://source.pixiv.net/common/images/no_profile.png"
//     },
//     "id": "17944295",
//     "name": "mysticmana",
//     "account": "mysticmana",
//     "mail_address": "mysticmana@gmail.com",
//     "is_premium": false,
//     "x_restrict": 2,
//     "is_mail_authorized": true
//   }
// }

export function login(email, password) {
  return {
    type: LOGIN_REQUEST,
    payload: {
      email,
      password,
    },
  };
}

export function successLogin(json) {
  return {
    type: LOGIN_SUCCESS,
    payload: {
      user: {
        ...json.user,
        id: parseInt(json.user.id),
        accessToken: json.access_token,
        refreshToken: json.refresh_token, // not working now
        expiresIn: json.expires_in,
      },
      timestamp: Date.now(),
    },
  };
}

export function failedLogin() {
  return {
    type: LOGIN_FAILURE,
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}

export function doneRehydrate() {
  return {
    type: AUTH_REHYDRATE_DONE,
  };
}

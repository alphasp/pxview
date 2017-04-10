//import jwtDecode from "jwt-decode";
// import { push } from 'react-router-redux'
import * as Keychain from 'react-native-keychain';
import { addError, resetError } from './error';
import pixiv from '../helpers/ApiClient';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';
export const REFRESH_TOKEN_REQUEST = 'REFRESH_TOKEN_REQUEST';
export const REFRESH_TOKEN_SUCCESS = 'REFRESH_TOKEN_SUCCESS';
export const REFRESH_TOKEN_FAILURE = 'REFRESH_TOKEN_FAILURE';
export const REFRESH_TOKEN_DONE = 'REFRESH_TOKEN_DONE';
export const AUTH_REHYDRATE_DONE = 'AUTH_REHYDRATE_DONE';

const defaultUser = {
  "access_token": "-L9fVk2G8esw5Oqx7W7URMUgHx5S1SwNjrDOKlnPXBM",
  "expires_in": 3600,
  "token_type": "bearer",
  "scope": "unlimited",
  "refresh_token": "jDS72HEvnwlRypILeIu46-WRs9cw1C6-p11tf89SegM",
  "user": {
    "profile_image_urls": {
      "px_16x16": "https://source.pixiv.net/common/images/no_profile_ss.png",
      "px_50x50": "https://source.pixiv.net/common/images/no_profile_s.png",
      "px_170x170": "https://source.pixiv.net/common/images/no_profile.png"
    },
    "id": "17944295",
    "name": "mysticmana",
    "account": "mysticmana",
    "mail_address": "mysticmana@gmail.com",
    "is_premium": false,
    "x_restrict": 2,
    "is_mail_authorized": true
  }
}

export function requestLogin(email, password) {
  return {
    type: LOGIN_REQUEST,
    payload: {
      email,
      password
    }
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
        refreshToken: json.refresh_token, //not working now
        expiresIn: json.expires_in,
      },
      timestamp: Date.now(),
    }
  };
}

export function failedLogin() {
  return {
    type: LOGIN_FAILURE
  };
}

export function logUserOut() {
  return {
    type: LOGOUT
  }
}

function refreshToken(refreshTokenPromise) {
  return {
    type: REFRESH_TOKEN_REQUEST,
    payload: {
      refreshTokenPromise
    }
  }
}

function successRefreshToken(json) {
  return {
    type: REFRESH_TOKEN_SUCCESS,
    payload: {
      user: {
        ...json.user,
        id: parseInt(json.user.id),
        accessToken: json.access_token,
        refreshToken: json.refresh_token,
        expiresIn: json.expires_in,
      },
      timestamp: Date.now(),
    }
  }
}

function failedRefreshToken() {
  return {
    type: REFRESH_TOKEN_FAILURE
  };
}

export function doneRefreshToken() {
  return {
    type: REFRESH_TOKEN_DONE
  }
}

export function doneRehydrate() {
  return {
    type: AUTH_REHYDRATE_DONE
  }
}

function postLogin(email, password) {
  return dispatch => {
    dispatch(resetError());
    dispatch(requestLogin());
    // const json = {
    //   "response": {
    //     "access_token": "-L9fVk2G8esw5Oqx7W7URMUgHx5S1SwNjrDOKlnPXBM",
    //     "expires_in": 3600,
    //     "token_type": "bearer",
    //     "scope": "unlimited",
    //     "refresh_token": "jDS72HEvnwlRypILeIu46-WRs9cw1C6-p11tf89SegM",
    //     "user": {
    //       "profile_image_urls": {
    //         "px_16x16": "https://source.pixiv.net/common/images/no_profile_ss.png",
    //         "px_50x50": "https://source.pixiv.net/common/images/no_profile_s.png",
    //         "px_170x170": "https://source.pixiv.net/common/images/no_profile.png"
    //       },
    //       "id": "17944295",
    //       "name": "mysticmana",
    //       "account": "mysticmana",
    //       "mail_address": "mysticmana@gmail.com",
    //       "is_premium": false,
    //       "x_restrict": 2,
    //       "is_mail_authorized": true
    //     }
    //   }
    // }
    // return new Promise((resolve, reject) => {
    //   return resolve(dispatch(successLogin(json)));
    //   // return resolve(Actions.pop());
    //   //return resolve(Actions.pop({ refresh: { test: true }}));
    // });

    return pixiv.login(email, password, false).then(json => {
      return Keychain.setGenericPassword(email, password).then(() => {
        return dispatch(successLogin(json));
      });      
      //Actions.pop();
      //Actions.pop({ refresh: { test: true }})
    }).catch(err => {
      dispatch(failedLogin());
      console.log('err on login ', err)
      return dispatch(addError((err.errors && err.errors.system && err.errors.system.message) ? err.errors.system.message : ""));
    });
  };
}

function shouldPostLogin(state, email, password) {
  if (!email || !password) return false;

  const result = state.auth;
  if (result && result.loading) {
    return false;
  } else {
    return true;
  }
}


// export function login(email, password) {
//   return (dispatch, getState) => {
//     if (shouldPostLogin(getState(), email, password)) {
//       return dispatch(postLogin(email, password));
//     }
//   };
// }

export function login(email, password) {
  return {
    type: LOGIN_REQUEST,
    payload: {
      email,
      password
    }
  };
}


export function logout() {
  return (dispatch, getState) => {
    Keychain.resetGenericPassword().then(() => {
      return pixiv.logout().then(() => {
        dispatch(logUserOut());
      });
    });
    //Actions.pop();
    //Actions.tabs({ type: ActionConst.RESET });
  }
}

// export function requestRefreshToken(dispatch) {
//   // const promise = Promise.resolve().then(() => {
//   //   return dispatch(successRefreshToken(defaultUser));
//   // }).catch(err => {
//   //   dispatch(failedRefreshToken());
//   //   return dispatch(addError((err && err.errors && err.errors.system && err.errors.system.message) ? err.errors.system.message : err));
//   // });
//   dispatch(refreshToken(Promise.resolve()));
//   const promise = Keychain.getGenericPassword()
//     .then(credentials => {
//       if (credentials.username && credentials.password) {
//         return pixiv.login(credentials.username, credentials.password).then(json => {
//           dispatch(successRefreshToken(json));
//           dispatch(doneRefreshToken());
//         }).catch(err => {
//           dispatch(failedRefreshToken());
//           //An error occured, please try again
//           dispatch(addError((err && err.errors && err.errors.system && err.errors.system.message) ? err.errors.system.message : err));
//           dispatch(doneRefreshToken());
//         });
//       }
//       else {
//         return dispatch(doneRefreshToken());
//       }
//     });
//   return promise;
// }

// export function requestRefreshToken() {
//   return (dispatch, getState) => {
//     console.log('requestRefreshToken')
//     return Promise.resolve().then(() => {
//       dispatch(successRefreshToken());
//     });
//     // return pixiv.login('mysticmana', 'tester123').then(json => {
//     //   dispatch(successRefreshToken(json));
//     // })
//     // .catch(err => {
//     //   dispatch(failedRefreshToken());
//     //   console.log('err on refresh token ', err)
//     //   dispatch(addError((err.errors && err.errors.system && err.errors.system.message) ? err.errors.system.message : ""));
//     // });
//   }
// } 
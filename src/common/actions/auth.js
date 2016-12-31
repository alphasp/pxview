//import jwtDecode from "jwt-decode";
// import { push } from 'react-router-redux'
import { Actions, ActionConst } from 'react-native-router-flux';
import { addError, resetError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const SUCCESS_LOGIN = 'SUCCESS_LOGIN';
export const FAILED_LOGIN = 'FAILED_LOGIN';
export const LOGOUT = 'LOGOUT';
export const REQUEST_REFRESH_TOKEN = 'REQUEST_REFRESH_TOKEN';
export const SUCCESS_REFRESH_TOKEN = 'SUCCESS_REFRESH_TOKEN';
export const FAILED_REFRESH_TOKEN = 'FAILED_REFRESH_TOKEN';

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

function requestLogin() {
  return {
    type: REQUEST_LOGIN
  };
}

function successLogin(json) {
  return {
    type: SUCCESS_LOGIN,
    payload: {
      user: {
        ...json.user,
        accessToken: json.access_token,
        refreshToken: json.refresh_token, //not working now
        expiresIn: json.expires_in,
      },
      receivedAt: Date.now(),
    }
  };
}

function failedLogin() {
  return {
    type: FAILED_LOGIN
  };
}

function logUserOut() {
  return {
    type: LOGOUT
  }
}

function refreshToken(refreshTokenPromise) {
  return {
    type: REQUEST_REFRESH_TOKEN,
    payload: {
      refreshTokenPromise
    }
  }
}

function successRefreshToken(json) {
  return {
    type: SUCCESS_REFRESH_TOKEN,
    payload: {
      user: {
        ...json.user,
        accessToken: json.access_token,
        refreshToken: json.refresh_token,
        expiresIn: json.expires_in,
      },
      receivedAt: Date.now(),
    }
  }
}

function failedRefreshToken() {
  return {
    type: FAILED_REFRESH_TOKEN
  };
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

    return pixiv.login(email, password).then(json => {
      dispatch(successLogin(json));
      //Actions.pop();
      //Actions.pop({ refresh: { test: true }})
    }).catch(err => {
      dispatch(failedLogin());
      console.log('err on login ', err)
      dispatch(addError((err.errors && err.errors.system && err.errors.system.message) ? err.errors.system.message : ""));
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

export function login(email, password) {
  return (dispatch, getState) => {
    if (shouldPostLogin(getState(), email, password)) {
      return dispatch(postLogin(email, password));
    }
  };
}

export function logout() {
  return (dispatch, getState) => {
    dispatch(logUserOut());
    //Actions.pop();
    //Actions.tabs({ type: ActionConst.RESET });
  }
}

export function requestRefreshToken(dispatch) {
  // const promise = Promise.resolve().then(() => {
  //   return dispatch(successRefreshToken(defaultUser));
  // }).catch(err => {
  //   dispatch(failedRefreshToken());
  //   return dispatch(addError((err && err.errors && err.errors.system && err.errors.system.message) ? err.errors.system.message : err));
  // });
  const promise = pixiv.login('mysticmana', 'tester123').then(json => {
    return dispatch(successRefreshToken(json));
  }).catch(err => {
    dispatch(failedRefreshToken());
    return dispatch(addError((err && err.errors && err.errors.system && err.errors.system.message) ? err.errors.system.message : err));
  });
  dispatch(refreshToken(Promise.resolve()));
  return promise;
} 

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
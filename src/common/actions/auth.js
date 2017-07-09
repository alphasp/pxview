import {
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_REFRESH_ACCESS_TOKEN,
  AUTH_REHYDRATE,
} from '../constants/actionTypes';

export function login(email, password) {
  return {
    type: AUTH_LOGIN.REQUEST,
    payload: {
      email,
      password,
    },
  };
}

export function loginSuccess(json) {
  return {
    type: AUTH_LOGIN.SUCCESS,
    payload: {
      user: {
        ...json.user,
        id: parseInt(json.user.id, 10),
        accessToken: json.access_token,
        refreshToken: json.refresh_token,
        expiresIn: json.expires_in,
      },
      timestamp: Date.now(),
    },
  };
}

export function loginFailure() {
  return {
    type: AUTH_LOGIN.FAILURE,
  };
}

export function logout() {
  return {
    type: AUTH_LOGOUT.SUCCESS,
  };
}

export function refreshAccessToken(refreshToken) {
  return {
    type: AUTH_REFRESH_ACCESS_TOKEN.REQUEST,
    payload: {
      refreshToken,
    },
  };
}

export function refreshAccessTokenSuccess(json) {
  return {
    type: AUTH_REFRESH_ACCESS_TOKEN.SUCCESS,
    payload: {
      user: {
        ...json.user,
        id: parseInt(json.user.id, 10),
        accessToken: json.access_token,
        refreshToken: json.refresh_token,
        expiresIn: json.expires_in,
      },
      timestamp: Date.now(),
    },
  };
}

export function refreshAccessTokenFailure() {
  return {
    type: AUTH_REFRESH_ACCESS_TOKEN.FAILURE,
  };
}

export function rehydrateSuccess() {
  return {
    type: AUTH_REHYDRATE.SUCCESS,
  };
}

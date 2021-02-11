import {
  AUTH_LOGIN,
  AUTH_SIGNUP,
  AUTH_LOGOUT,
  AUTH_REFRESH_ACCESS_TOKEN,
  AUTH_REHYDRATE,
} from '../constants/actionTypes';

export function tokenRequest(code, codeVerifier) {
  return {
    type: AUTH_LOGIN.REQUEST,
    payload: {
      code,
      codeVerifier,
    },
  };
}

// todo
export function login(email, password, isProvisionalAccount = false) {
  return {
    type: AUTH_LOGIN.REQUEST,
    payload: {
      email,
      password,
      isProvisionalAccount,
    },
  };
}

export function loginSuccess(json, options) {
  const payload = {
    user: {
      ...json.user,
      id: parseInt(json.user.id, 10),
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
      expiresIn: json.expires_in,
    },
    timestamp: Date.now(),
  };
  if (options && options.isProvisionalAccount && options.password) {
    payload.user = {
      ...payload.user,
      isProvisionalAccount: options.isProvisionalAccount,
      password: options.password,
    };
  }
  return {
    type: AUTH_LOGIN.SUCCESS,
    payload,
  };
}

export function loginFailure() {
  return {
    type: AUTH_LOGIN.FAILURE,
  };
}

// Cancel watch login request saga
export function stopLogin() {
  return {
    type: AUTH_LOGIN.STOP,
  };
}

export function signUp(nickname) {
  return {
    type: AUTH_SIGNUP.REQUEST,
    payload: {
      nickname,
    },
  };
}

export function signUpSuccess(json) {
  return {
    type: AUTH_SIGNUP.SUCCESS,
    payload: {
      username: json.user_account,
      password: json.password,
      // deviceToken": json.device_token,
      timestamp: Date.now(),
    },
  };
}

export function signUpFailure() {
  return {
    type: AUTH_SIGNUP.FAILURE,
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

export function refreshAccessTokenSuccess(json, options) {
  const payload = {
    user: {
      ...json.user,
      id: parseInt(json.user.id, 10),
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
      expiresIn: json.expires_in,
    },
    timestamp: Date.now(),
  };
  if (options && options.isProvisionalAccount && options.password) {
    payload.user = {
      ...payload.user,
      isProvisionalAccount: options.isProvisionalAccount,
      password: options.password,
    };
  }
  return {
    type: AUTH_REFRESH_ACCESS_TOKEN.SUCCESS,
    payload,
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

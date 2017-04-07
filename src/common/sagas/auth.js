import { delay } from 'redux-saga';
import { take, fork, call, put, race } from 'redux-saga/effects';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT,
  successLogin,
  failedLogin,
  logUserOut
} from '../actions/auth.js'
import * as Keychain from 'react-native-keychain';
import { addError, resetError } from '../actions/error';
import pixiv from '../helpers/ApiClient';

export function* authorize(email, password) {
  const loginResponse = yield call(pixiv.login, email, password)
  yield call(Keychain.setGenericPassword, email, password);
  yield put(successLogin(loginResponse));
  return loginResponse;
}

export function* authAndRefreshTokenOnExpiry(email, password) {
  const loginResponse = yield call(authorize, email, password)
  while(true) {
    const credentials  = yield call (Keychain.getGenericPassword);
    if (credentials.email && credentials.password) {
      //refresh token 5 min before expire
      yield call(delay, loginResponse.expires_in - 300)
      yield call(authorize, credentials.email, credentials.password) 
    }
  }
}

export function* watchLoginRequest() {
  // yield takeEvery(LOGIN_REQUEST, loginFlow)
  while(true) {
    try {
      const action = yield take(LOGIN_REQUEST)
      const { email, password } = action.payload;
      yield race([
        take(LOGOUT),
        call(authAndRefreshTokenOnExpiry, email, password)
      ])
      // user logged out, next while iteration will wait for the
      // next LOGIN_REQUEST action
    } 
    catch(err) {
      const errMessage = (err.errors && err.errors.system && err.errors.system.message) ? err.errors.system.message : '';
      yield put(failedLogin());
      yield put(addError(errMessage));    
    }
  }
}

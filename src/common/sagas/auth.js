import { delay } from 'redux-saga';
import { take, takeLatest, fork, call, apply, put, race, select } from 'redux-saga/effects';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT,
  login,
  successLogin,
  failedLogin,
  logout,
  doneRehydrate,
} from '../actions/auth.js';
import * as Keychain from 'react-native-keychain';
import { REHYDRATE } from 'redux-persist/constants';
import { addError, resetError } from '../actions/error';
import pixiv from '../helpers/ApiClient';
import { getAuthUser } from '../selectors';

export function* authorize(email, password) {
  // use apply instead of call to pass this to function
  const loginResponse = yield apply(pixiv, pixiv.login, [email, password]);
  yield call(Keychain.setGenericPassword, email, password);
  yield put(successLogin(loginResponse));
  return loginResponse;
}

export function* authAndRefreshTokenOnExpiry(email, password) {
  const loginResponse = yield call(authorize, email, password);
  while (true) {
    const credentials = yield call(Keychain.getGenericPassword);
    if (credentials.username && credentials.password) {
      // refresh token 5 min before expire
      // convert expires in to milisecond
      const delayMilisecond = (loginResponse.expires_in - 300) * 1000;
      yield call(delay, delayMilisecond);
      try {
        yield call(authorize, credentials.username, credentials.password);
      }
      catch (err) {
        yield put(logout());
      }
    }
  }
}

export function* watchLoginRequest() {
  // yield takeEvery(LOGIN_REQUEST, loginFlow)
  while (true) {
    try {
      const action = yield take(LOGIN_REQUEST);
      const { email, password } = action.payload;
      yield race([
        take(LOGOUT),
        call(authAndRefreshTokenOnExpiry, email, password),
      ]);
      yield call(handleLogout);
      // user logged out, next while iteration will wait for the
      // next LOGIN_REQUEST action
    }
    catch (err) {
      const errMessage = (err.errors && err.errors.system && err.errors.system.message) ? err.errors.system.message : '';
      yield put(failedLogin());
      yield put(addError(errMessage));
    }
  }
}

export function* handleLogout() {
  yield [
    call(Keychain.resetGenericPassword),
    apply(pixiv, pixiv.logout),
  ];
}

// wait rehydrate complete, login if authUser exist, then run other api
export function* watchRehydrate() {
  while (true) {
    try {
      yield take(REHYDRATE);
      const user = yield select(getAuthUser);
      if (user) {
        console.log('watchRehydrate login');
        const credentials = yield call(Keychain.getGenericPassword);
        yield put(login(credentials.username, credentials.password));
        yield take([
          LOGIN_SUCCESS,
          LOGIN_ERROR,
        ]);
      }
      // todo put sync complete
      yield put(doneRehydrate());
    }
    catch (err) {
      // todo logout user
      console.log('err in watchRehydrate ', err);
    }
  }
}

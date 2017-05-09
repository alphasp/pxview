import { delay } from 'redux-saga';
import { take, call, apply, put, race, select } from 'redux-saga/effects';
import * as Keychain from 'react-native-keychain';
import moment from 'moment';
import { REHYDRATE } from 'redux-persist/constants';
import { FOREGROUND, BACKGROUND } from 'redux-enhancer-react-native-appstate';
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
} from '../actions/auth';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { getAuth, getAuthUser } from '../selectors';

export function* authorize(email, password) {
  // use apply instead of call to pass this to function
  const loginResponse = yield apply(pixiv, pixiv.login, [email, password]);
  yield call(Keychain.setGenericPassword, email, password);
  yield put(successLogin(loginResponse));
  return loginResponse;
}

export function* scheduleRefreshToken(credentials, delayMilisecond) {
  yield call(delay, delayMilisecond);
  try {
    const response = yield call(
      authorize,
      credentials.username,
      credentials.password,
    );
    return response;
  } catch (err) {
    yield put(logout());
  }
  return null;
}

export function* authAndRefreshTokenOnExpiry(email, password) {
  const loginResponse = yield call(authorize, email, password);
  // refresh token 5 min before expire
  // convert expires in to milisecond
  let delayMilisecond = (loginResponse.expires_in - 300) * 1000;
  while (true) {
    const credentials = yield call(Keychain.getGenericPassword);
    if (credentials.username && credentials.password) {
      // cancel scheduleRefreshToken if app state changed to background
      const { background, refreshTokenResponse } = yield race({
        background: take(BACKGROUND),
        refreshTokenResponse: call(
          scheduleRefreshToken,
          credentials,
          delayMilisecond,
        ),
      });
      // wait for app back to foreground before scheduleRefreshToken
      if (background && background.type === BACKGROUND) {
        yield take(FOREGROUND);
        const auth = yield select(getAuth);
        const now = moment();
        const end = moment(auth.timestamp);
        const duration = moment.duration(now.diff(end));
        const ms = duration.asMilliseconds();
        delayMilisecond -= ms;
      } else if (refreshTokenResponse) {
        delayMilisecond = (refreshTokenResponse.expires_in - 300) * 1000;
      }
    }
  }
}

export function* handleLogout() {
  yield [call(Keychain.resetGenericPassword), apply(pixiv, pixiv.logout)];
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
    } catch (err) {
      const errMessage = err.errors &&
        err.errors.system &&
        err.errors.system.message
        ? err.errors.system.message
        : '';
      yield put(failedLogin());
      yield put(addError(errMessage));
    }
  }
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
        if (credentials) {
          yield put(login(credentials.username, credentials.password));
        } else {
          yield put(logout());
        }
        yield take([LOGIN_SUCCESS, LOGIN_ERROR, LOGOUT]);
      }
      // todo put sync complete
      yield put(doneRehydrate());
    } catch (err) {
      // todo logout user
      console.log('err in watchRehydrate ', err);
    }
  }
}

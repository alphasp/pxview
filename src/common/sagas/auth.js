import { takeEvery, fork, call, put } from 'redux-saga/effects';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  successLogin,
  failedLogin,
  logUserOut
} from '../actions/auth.js'
// import * as Keychain from 'react-native-keychain';
import { addError, resetError } from '../actions/error';
import pixiv from '../helpers/ApiClient';

export function* authorize(email, password) {
  try {
    const json = yield call(pixiv.login, email, password)
    yield put(successLogin(json))
    // yield call(Api.storeItem, {token})
    return json;
  } 
  catch(err) {
    yield [put(failedLogin()), put(addError((err.errors && err.errors.system && err.errors.system.message) ? err.errors.system.message : ""))];
  } 
  // finally {
  //   if (yield cancelled()) {
  //     // ... put special cancellation handling code here
  //     // dispatch a dedicated action RESET_LOGIN_PENDING
  //     // or more simply, make the reducer clear the isLoginPending on a LOGOUT action
  //   }
  // }
}

// try {
//         const response = yield call(loginAPI, {
//             username,
//             password
//         })
//         yield put({
//             type: LOGIN_SUCCESS,
//             response
//         })
//     } catch (error) {
//         yield put({
//             type: LOGIN_ERROR,
//             error
//         })
//     }

// export function* loginFlow({ email, password }) {
export function* loginFlow(action) {
  const { email, password } = action.payload;

  try {
    const json = yield call(pixiv.login, email, password)
    yield put(successLogin(json))
    // yield call(Api.storeItem, {token})
    return json;
  } 
  catch(err) {
    //yield [put(failedLogin()), put(addError())];
    yield put(failedLogin());
    yield put(addError());
    //yield put(addError((err.errors && err.errors.system && err.errors.system.message) ? err.errors.system.message : ""));
  } 


  // yield fork(authorize, email, password);
  // yield take(LOGIN_CANCEL)
  // yield cancel(task)


  // while (true) {
  //   const {user, password} = yield take(LOGIN_REQUEST)
  //   // fork return a Task object
  //   const task = yield fork(authorize, user, password)
  //   // const action = yield take(['LOGOUT', 'LOGIN_ERROR'])
  //   // if (action.type === 'LOGOUT')
  //   //   yield cancel(task)
  //   // yield call(Api.clearItem, 'token')
  // }
}

export function* watchLoginRequest() {
  yield takeEvery(LOGIN_REQUEST, loginFlow)
}
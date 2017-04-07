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

// function* apiSaga(fn, args, successAction, errorAction) {
//   try {
//     const { response } = yield call(fn, ...args)
//     yield put(successAction(response)
//   } 
//   catch(err) {
//     yield put(errorAction(error));
//   }
// }

export function matchRequest(action) {
  console.log('matchRequest ' , action.type.includes('REQUEST') && !action.type.includes('LOGIN_REQUEST'))
  return action.type.includes('REQUEST') && !action.type.includes('LOGIN_REQUEST');
}

export function* watchApiRequest() {
  while(true) {
    try {
      // /^(?=.*REQUEST)(?!.LOGIN_REQUEST).*/.test(action.type)
      const action = yield take(matchRequest)
      //const action = yield take('*REQUEST');
      // action.payload;
      console.log('watch api action ', action)
      //yield put(failedLogin());
    }
    catch (err) {
      console.log('ee ', err)
    }
    // catch(err) {
    //   const errMessage = (err.errors && err.errors.system && err.errors.system.message) ? err.errors.system.message : '';
    //   yield put(failedLogin());
    //   yield put(addError(errMessage));    
    // }
  }
}


// // this one is used on many places
// function* fetchRecommendedPublicFromApi(options, nextUrl) {
//   const params = qs.parse(nextUrl);
//   const offset = params.offset || "0";
//   const requestPromise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.illustRecommendedPublic(options);

//   const normalized = normalize(json.illusts, Schemas.ILLUST_ARRAY);
//   dispatch(receiveRecommended(normalized, json.next_url, true, offset, nextUrl));
  

//   yield* apiSaga(requestPromise, actions.userFetchSuccess, actions.userFetchError)
// }


// function fetchRecommendedPublicFromApi(options, nextUrl) {
//   return dispatch => {
//     const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.illustRecommendedPublic(options);
//     const params = qs.parse(nextUrl);
//     const offset = params.offset || "0";
//     dispatch(requestRecommended(true, offset, nextUrl));
//     return promise
//       .then(json => {
//         const normalized = normalize(json.illusts, Schemas.ILLUST_ARRAY);
//         dispatch(receiveRecommended(normalized, json.next_url, true, offset, nextUrl));
//       })
//       .catch(err => {
//         dispatch(stopRecommended());
//         dispatch(addError(err));
//       });
//   };
// }

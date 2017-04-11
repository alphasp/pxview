import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchUserIllustsSuccess,
  fetchUserIllustsFailure,
} from '../actions/userIllusts.js'
import { addError } from '../actions/error';
import pixiv from '../helpers/ApiClient';
import { USER_ILLUSTS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchUserIllusts(action) {
  const { userId, options, nextUrl } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    }
    else {
      const options = { type: 'illust' };
      response = yield apply(pixiv, pixiv.userIllusts, [userId, options]);
    }
    const normalized = normalize(response.illusts, Schemas.ILLUST_ARRAY);
    yield put(fetchUserIllustsSuccess(normalized.entities, normalized.result, userId, response.next_url));
  } 
  catch(err) {
    yield put(fetchUserIllustsFailure(userId));
    yield put(addError(err));    
  }
}

export function* watchFetchUserIllusts() {
  yield takeEvery(USER_ILLUSTS.REQUEST, handleFetchUserIllusts);
}
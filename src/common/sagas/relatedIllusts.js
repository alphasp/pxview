import { normalize } from 'normalizr';
import { takeEvery, apply, put, select } from 'redux-saga/effects';
import {
  fetchRelatedIllustsSuccess,
  fetchRelatedIllustsFailure,
} from '../actions/relatedIllusts.js'
import { addError } from '../actions/error';
import pixiv from '../helpers/ApiClient';
import { RELATED_ILLUSTS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';
import { getAuthUser } from '../selectors';

export function* handleFetchRelatedIllusts(action) {
  try {
    const { illustId, options, nextUrl } = action.payload;
    const user = yield select(getAuthUser);
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    }
    else {
      response = yield apply(pixiv, pixiv.illustRelated, [illustId, options]);
    }
    const normalized = normalize(response.illusts, Schemas.ILLUST_ARRAY);
    yield put(fetchRelatedIllustsSuccess(normalized.entities, normalized.result, illustId, response.next_url));
  } 
  catch(err) {
    yield put(fetchRelatedIllustsFailure());
    yield put(addError(err));    
  }
}

export function* watchFetchRelatedIllusts() {
  yield takeEvery(RELATED_ILLUSTS.REQUEST, handleFetchRelatedIllusts);
}

// function shouldFetchRelatedIllust(state, illustId) {
//   if (!illustId) {
//     return false;
//   }
//   const results = state.relatedIllusts[illustId];
//   if (results && results.loading) {
//     return false;
//   } else {
//     return true;
//   }
// }
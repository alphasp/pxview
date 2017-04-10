import { normalize } from 'normalizr';
import { takeLatest, apply, put, select } from 'redux-saga/effects';
import {
  fetchRecommendedIllustsSuccess,
  fetchRecommendedIllustsFailure,
} from '../actions/recommendedIllusts.js'
import { addError } from '../actions/error';
import pixiv from '../helpers/ApiClient';
import { RECOMMENDED_ILLUSTS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';
import { getAuthUser } from '../selectors';

export function* handleFetchRecommendedIllusts(action) {
  try {
    const { options, nextUrl } = action.payload;
    const user = yield select(getAuthUser);
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    }
    else {
      if (user) {
        response = yield apply(pixiv, pixiv.illustRecommended, [options]);
      }
      else {
        response = yield apply(pixiv, pixiv.illustRecommendedPublic, [options]);
      }
    }
    const normalized = normalize(response.illusts, Schemas.ILLUST_ARRAY);
    yield put(fetchRecommendedIllustsSuccess(normalized.entities, normalized.result, response.next_url));
  } 
  catch(err) {
    yield put(fetchRecommendedIllustsFailure());
    yield put(addError(err));    
  }
}

export function* watchFetchRecommendedIllusts() {
  yield takeLatest(RECOMMENDED_ILLUSTS.REQUEST, handleFetchRecommendedIllusts);
}
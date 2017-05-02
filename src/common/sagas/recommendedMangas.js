import { normalize } from 'normalizr';
import { takeLatest, apply, put, select } from 'redux-saga/effects';
import {
  fetchRecommendedMangasSuccess,
  fetchRecommendedMangasFailure,
} from '../actions/recommendedMangas.js';
import { addError } from '../actions/error';
import pixiv from '../helpers/ApiClient';
import { RECOMMENDED_MANGAS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';
import { getAuthUser } from '../selectors';

export function* handleFetchRecommendedMangas(action) {
  try {
    const { options, nextUrl } = action.payload;
    const user = yield select(getAuthUser);
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    }
    else {
      response = yield apply(pixiv, pixiv.mangaRecommended, [options]);
    }
    const normalized = normalize(response.illusts, Schemas.ILLUST_ARRAY);
    yield put(fetchRecommendedMangasSuccess(normalized.entities, normalized.result, response.next_url));
  }
  catch (err) {
    yield put(fetchRecommendedMangasFailure());
    yield put(addError(err));
  }
}

export function* watchFetchRecommendedMangas() {
  yield takeLatest(RECOMMENDED_MANGAS.REQUEST, handleFetchRecommendedMangas);
}

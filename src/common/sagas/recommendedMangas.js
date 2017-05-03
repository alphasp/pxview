import { normalize } from 'normalizr';
import { takeLatest, apply, put } from 'redux-saga/effects';
import {
  fetchRecommendedMangasSuccess,
  fetchRecommendedMangasFailure,
} from '../actions/recommendedMangas';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { RECOMMENDED_MANGAS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchRecommendedMangas(action) {
  try {
    const { options, nextUrl } = action.payload;
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    }
    else {
      response = yield apply(pixiv, pixiv.mangaRecommended, [options]);
    }
    const normalized = normalize(response.illusts, Schemas.ILLUST_ARRAY);
    yield put(fetchRecommendedMangasSuccess(
      normalized.entities,
      normalized.result,
      response.next_url,
    ));
  }
  catch (err) {
    yield put(fetchRecommendedMangasFailure());
    yield put(addError(err));
  }
}

export function* watchFetchRecommendedMangas() {
  yield takeLatest(RECOMMENDED_MANGAS.REQUEST, handleFetchRecommendedMangas);
}

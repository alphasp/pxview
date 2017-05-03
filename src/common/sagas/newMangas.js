import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchNewMangasSuccess,
  fetchNewMangasFailure,
} from '../actions/newMangas';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { NEW_MANGAS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchNewMangas(action) {
  const { nextUrl, options } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    }
    else {
      response = yield apply(pixiv, pixiv.mangaNew, [options]);
    }
    const normalized = normalize(response.illusts, Schemas.ILLUST_ARRAY);
    yield put(fetchNewMangasSuccess(normalized.entities, normalized.result, response.next_url));
  }
  catch (err) {
    yield put(fetchNewMangasFailure());
    yield put(addError(err));
  }
}

export function* watchFetchNewMangas() {
  yield takeEvery(NEW_MANGAS.REQUEST, handleFetchNewMangas);
}

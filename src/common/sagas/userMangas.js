import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchUserMangasSuccess,
  fetchUserMangasFailure,
} from '../actions/userMangas.js';
import { addError } from '../actions/error';
import pixiv from '../helpers/ApiClient';
import { USER_MANGAS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchUserMangas(action) {
  const { userId, nextUrl } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    }
    else {
      const options = { type: 'manga' };
      response = yield apply(pixiv, pixiv.userIllusts, [userId, options]);
    }
    const normalized = normalize(response.illusts, Schemas.ILLUST_ARRAY);
    yield put(fetchUserMangasSuccess(normalized.entities, normalized.result, userId, response.next_url));
  }
  catch (err) {
    yield put(fetchUserMangasFailure(userId));
    yield put(addError(err));
  }
}

export function* watchFetchUserMangas() {
  yield takeEvery(USER_MANGAS.REQUEST, handleFetchUserMangas);
}

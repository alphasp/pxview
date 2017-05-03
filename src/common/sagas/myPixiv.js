import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchMyPixivSuccess,
  fetchMyPixivFailure,
} from '../actions/myPixiv';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { MY_PIXIV } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchMyPixiv(action) {
  const { nextUrl } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    }
    else {
      response = yield apply(pixiv, pixiv.illustMyPixiv);
    }
    const normalized = normalize(response.illusts, Schemas.ILLUST_ARRAY);
    yield put(fetchMyPixivSuccess(normalized.entities, normalized.result, response.next_url));
  }
  catch (err) {
    yield put(fetchMyPixivFailure());
    yield put(addError(err));
  }
}

export function* watchFetchMyPixiv() {
  yield takeEvery(MY_PIXIV.REQUEST, handleFetchMyPixiv);
}

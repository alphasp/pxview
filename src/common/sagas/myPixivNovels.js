import { normalize } from 'normalizr';
import { takeLatest, apply, put } from 'redux-saga/effects';
import {
  fetchMyPixivNovelsSuccess,
  fetchMyPixivNovelsFailure,
} from '../actions/myPixivNovels';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { MY_PIXIV_NOVELS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchMyPixivNovels(action) {
  try {
    const { nextUrl } = action.payload;
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      response = yield apply(pixiv, pixiv.novelMyPixiv);
    }
    const normalized = normalize(
      response.novels.filter((novel) => novel.visible && novel.id),
      Schemas.NOVEL_ARRAY,
    );
    yield put(
      fetchMyPixivNovelsSuccess(
        normalized.entities,
        normalized.result,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchMyPixivNovelsFailure());
    yield put(addError(err));
  }
}

export function* watchFetchMyPixivNovels() {
  yield takeLatest(MY_PIXIV_NOVELS.REQUEST, handleFetchMyPixivNovels);
}

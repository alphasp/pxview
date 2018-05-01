import { normalize } from 'normalizr';
import { takeLatest, apply, put } from 'redux-saga/effects';
import {
  fetchNewNovelsSuccess,
  fetchNewNovelsFailure,
} from '../actions/newNovels';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { NEW_NOVELS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchNewNovels(action) {
  try {
    const { nextUrl } = action.payload;
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      response = yield apply(pixiv, pixiv.novelNew);
    }
    const normalized = normalize(
      response.novels.filter(novel => novel.visible && novel.id),
      Schemas.NOVEL_ARRAY,
    );
    yield put(
      fetchNewNovelsSuccess(
        normalized.entities,
        normalized.result,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchNewNovelsFailure());
    yield put(addError(err));
  }
}

export function* watchFetchNewNovels() {
  yield takeLatest(NEW_NOVELS.REQUEST, handleFetchNewNovels);
}

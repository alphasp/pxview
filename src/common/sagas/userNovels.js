import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchUserNovelsSuccess,
  fetchUserNovelsFailure,
} from '../actions/userNovels';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { USER_NOVELS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchUserNovels(action) {
  const { userId, nextUrl } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      response = yield apply(pixiv, pixiv.userNovels, [userId]);
    }
    const normalized = normalize(
      response.novels.filter((novel) => novel.visible && novel.id),
      Schemas.NOVEL_ARRAY,
    );
    yield put(
      fetchUserNovelsSuccess(
        normalized.entities,
        normalized.result,
        userId,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchUserNovelsFailure(userId));
    yield put(addError(err));
  }
}

export function* watchFetchUserNovels() {
  yield takeEvery(USER_NOVELS.REQUEST, handleFetchUserNovels);
}

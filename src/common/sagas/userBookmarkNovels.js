import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchUserBookmarkNovelsSuccess,
  fetchUserBookmarkNovelsFailure,
} from '../actions/userBookmarkNovels';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { USER_BOOKMARK_NOVELS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchUserBookmarkNovels(action) {
  const { userId, tag, nextUrl } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      const options = {};
      if (tag) {
        options.tag = tag;
      }
      response = yield apply(pixiv, pixiv.userBookmarksNovel, [
        userId,
        options,
      ]);
    }
    const normalized = normalize(
      response.novels.filter((novel) => novel.visible && novel.id),
      Schemas.NOVEL_ARRAY,
    );

    yield put(
      fetchUserBookmarkNovelsSuccess(
        normalized.entities,
        normalized.result,
        userId,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchUserBookmarkNovelsFailure(userId));
    yield put(addError(err));
  }
}

export function* watchFetchUserBookmarkNovels() {
  yield takeEvery(USER_BOOKMARK_NOVELS.REQUEST, handleFetchUserBookmarkNovels);
}

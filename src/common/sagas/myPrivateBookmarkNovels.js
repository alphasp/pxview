import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchMyPrivateBookmarkNovelsSuccess,
  fetchMyPrivateBookmarkNovelsFailure,
} from '../actions/myPrivateBookmarkNovels';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { MY_PRIVATE_BOOKMARK_NOVELS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchMyPrivateBookmarkNovels(action) {
  const { userId, tag, nextUrl } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      const options = { restrict: 'private' };
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
      fetchMyPrivateBookmarkNovelsSuccess(
        normalized.entities,
        normalized.result,
        userId,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchMyPrivateBookmarkNovelsFailure(userId));
    yield put(addError(err));
  }
}

export function* watchFetchMyPrivateBookmarkNovels() {
  yield takeEvery(
    MY_PRIVATE_BOOKMARK_NOVELS.REQUEST,
    handleFetchMyPrivateBookmarkNovels,
  );
}

import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchMyPrivateBookmarkIllustsSuccess,
  fetchMyPrivateBookmarkIllustsFailure,
} from '../actions/myPrivateBookmarkIllusts';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { MY_PRIVATE_BOOKMARK_ILLUSTS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchMyPrivateBookmarkIllusts(action) {
  const { userId, tag, nextUrl } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    }
    else {
      const options = { restrict: 'private' };
      if (tag) {
        options.tag = tag;
      }
      response = yield apply(pixiv, pixiv.userBookmarksIllust, [userId, options]);
    }
    const normalized = normalize(response.illusts, Schemas.ILLUST_ARRAY);
    yield put(fetchMyPrivateBookmarkIllustsSuccess(
      normalized.entities,
      normalized.result,
      userId,
      response.next_url,
    ));
  }
  catch (err) {
    yield put(fetchMyPrivateBookmarkIllustsFailure(userId));
    yield put(addError(err));
  }
}

export function* watchFetchMyPrivateBookmarkIllusts() {
  yield takeEvery(MY_PRIVATE_BOOKMARK_ILLUSTS.REQUEST, handleFetchMyPrivateBookmarkIllusts);
}

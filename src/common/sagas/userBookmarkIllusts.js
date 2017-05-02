import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchUserBookmarkIllustsSuccess,
  fetchUserBookmarkIllustsFailure,
} from '../actions/userBookmarkIllusts';
import { addError } from '../actions/error';
import pixiv from '../helpers/ApiClient';
import { USER_BOOKMARK_ILLUSTS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchUserBookmarkIllusts(action) {
  const { userId, tag, nextUrl } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    }
    else {
      const options = {};
      if (tag) {
        options.tag = tag;
      }
      response = yield apply(pixiv, pixiv.userBookmarksIllust, [userId, options]);
    }
    const normalized = normalize(response.illusts, Schemas.ILLUST_ARRAY);
    yield put(fetchUserBookmarkIllustsSuccess(normalized.entities, normalized.result, userId, response.next_url));
  }
  catch (err) {
    yield put(fetchUserBookmarkIllustsFailure(userId));
    yield put(addError(err));
  }
}

export function* watchFetchUserBookmarkIllusts() {
  yield takeEvery(USER_BOOKMARK_ILLUSTS.REQUEST, handleFetchUserBookmarkIllusts);
}

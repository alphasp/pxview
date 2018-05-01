import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchBookmarkNovelTagsSuccess,
  fetchBookmarkNovelTagsFailure,
} from '../actions/bookmarkNovelTags';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { BOOKMARK_NOVEL_TAGS } from '../constants/actionTypes';
import { TAG_TYPES } from '../constants';

export function* handleFetchBookmarkNovelTags(action) {
  const { tagType, nextUrl } = action.payload;
  try {
    const options = {
      restrict: tagType === TAG_TYPES.PRIVATE ? 'private' : 'public',
    };
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      response = yield apply(pixiv, pixiv.userBookmarkNovelTags, [options]);
    }
    const items = response.bookmark_tags.map(tag => ({
      name: tag.name,
      value: tag.name,
      count: tag.count,
    }));
    yield put(fetchBookmarkNovelTagsSuccess(items, tagType, response.next_url));
  } catch (err) {
    yield put(fetchBookmarkNovelTagsFailure(tagType));
    yield put(addError(err));
  }
}

export function* watchFetchBookmarkNovelTags() {
  yield takeEvery(BOOKMARK_NOVEL_TAGS.REQUEST, handleFetchBookmarkNovelTags);
}

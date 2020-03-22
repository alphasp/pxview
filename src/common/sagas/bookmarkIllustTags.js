import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchBookmarkIllustTagsSuccess,
  fetchBookmarkIllustTagsFailure,
} from '../actions/bookmarkIllustTags';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { BOOKMARK_ILLUST_TAGS } from '../constants/actionTypes';
import { TAG_TYPES } from '../constants';

export function* handleFetchBookmarkIllustTags(action) {
  const { tagType, nextUrl } = action.payload;
  try {
    const options = {
      restrict: tagType === TAG_TYPES.PRIVATE ? 'private' : 'public',
    };
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      response = yield apply(pixiv, pixiv.userBookmarkIllustTags, [options]);
    }
    const items = response.bookmark_tags.map((tag) => ({
      name: tag.name,
      value: tag.name,
      count: tag.count,
    }));
    yield put(
      fetchBookmarkIllustTagsSuccess(items, tagType, response.next_url),
    );
  } catch (err) {
    yield put(fetchBookmarkIllustTagsFailure(tagType));
    yield put(addError(err));
  }
}

export function* watchFetchBookmarkIllustTags() {
  yield takeEvery(BOOKMARK_ILLUST_TAGS.REQUEST, handleFetchBookmarkIllustTags);
}

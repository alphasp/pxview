import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchBookmarkTagsSuccess,
  fetchBookmarkTagsFailure,
} from '../actions/bookmarkTags.js'
import { addError } from '../actions/error';
import pixiv from '../helpers/ApiClient';
import { BOOKMARK_TAGS } from '../constants/actionTypes';
import { TAG_TYPES } from '../constants/tagTypes';

function mapTagType(tagType) {
  switch (tagType) {
    case TAG_TYPES.PUBLIC:
      return 'public';
    case TAG_TYPES.PRIVATE:
      return 'private';
  }
  return null;
}

export function* handleFetchBookmarkTags(action) {
  const { tagType, nextUrl } = action.payload;
  try {
    const mappedTagType = mapTagType(tagType);
    let options = {};
    if (mappedTagType) {
      options.restrict = mappedTagType;
    };
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    }
    else {
      response = yield apply(pixiv, pixiv.userBookmarkIllustTags, [options]);
    }
    const items = response.bookmark_tags.map(tag => {
      return {
        name: tag.name,
        value: tag.name,
        count: tag.count,
      }
    });
    yield put(fetchBookmarkTagsSuccess(items, tagType, response.next_url));
  } 
  catch(err) {
    yield put(fetchBookmarkTagsFailure(tagType));
    yield put(addError(err));    
  }
}

export function* watchBookmarkTags() {
  yield takeEvery(BOOKMARK_TAGS.REQUEST, handleFetchBookmarkTags);
}
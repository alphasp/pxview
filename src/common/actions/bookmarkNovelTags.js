import qs from 'qs';
import { BOOKMARK_NOVEL_TAGS } from '../constants/actionTypes';

export function fetchBookmarkNovelTagsSuccess(items, tagType, nextUrl) {
  return {
    type: BOOKMARK_NOVEL_TAGS.SUCCESS,
    payload: {
      items,
      tagType,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchBookmarkNovelTagsFailure(tagType) {
  return {
    type: BOOKMARK_NOVEL_TAGS.FAILURE,
    payload: {
      tagType,
    },
  };
}

export function fetchBookmarkNovelTags(tagType, nextUrl) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || '0';
  return {
    type: BOOKMARK_NOVEL_TAGS.REQUEST,
    payload: {
      tagType,
      offset,
      nextUrl,
    },
  };
}

export function clearBookmarkNovelTags(tagType) {
  return {
    type: BOOKMARK_NOVEL_TAGS.CLEAR,
    payload: {
      tagType,
    },
  };
}

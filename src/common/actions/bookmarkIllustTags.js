import qs from 'qs';
import { BOOKMARK_ILLUST_TAGS } from '../constants/actionTypes';

export function fetchBookmarkIllustTagsSuccess(items, tagType, nextUrl) {
  return {
    type: BOOKMARK_ILLUST_TAGS.SUCCESS,
    payload: {
      items,
      tagType,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchBookmarkIllustTagsFailure(tagType) {
  return {
    type: BOOKMARK_ILLUST_TAGS.FAILURE,
    payload: {
      tagType,
    },
  };
}

export function fetchBookmarkIllustTags(tagType, nextUrl) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || '0';
  return {
    type: BOOKMARK_ILLUST_TAGS.REQUEST,
    payload: {
      tagType,
      offset,
      nextUrl,
    },
  };
}

export function clearBookmarkIllustTags(tagType) {
  return {
    type: BOOKMARK_ILLUST_TAGS.CLEAR,
    payload: {
      tagType,
    },
  };
}

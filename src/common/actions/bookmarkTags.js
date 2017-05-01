//import { createAction } from 'redux-actions';
import qs from "qs";
import { BOOKMARK_TAGS } from '../constants/actionTypes';
import { TAG_TYPES } from '../constants/tagTypes';

export function fetchBookmarkTagsSuccess(items, tagType, nextUrl) {
  return {
    type: BOOKMARK_TAGS.SUCCESS,
    payload: {
      items,
      tagType,
      nextUrl,
      timestamp: Date.now(),
    }
  };
}

export function fetchBookmarkTagsFailure(tagType) {
  return {
    type: BOOKMARK_TAGS.FAILURE,
    payload: {
      tagType
    }
  };
}

export function fetchBookmarkTags(tagType, nextUrl) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || "0";
  return {
    type: BOOKMARK_TAGS.REQUEST,
    payload: {
      tagType,
      offset,
      nextUrl,
    }
  };
}

export function clearBookmarkTags(tagType) {
  return {
    type: BOOKMARK_TAGS.CLEAR,
    payload: {
      tagType
    }
  };
}
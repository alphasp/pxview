//import { createAction } from 'redux-actions';
import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_BOOKMARK_TAG = 'REQUEST_BOOKMARK_TAG';
export const RECEIVE_BOOKMARK_TAG = 'RECEIVE_BOOKMARK_TAG';
export const STOP_BOOKMARK_TAG = 'STOP_BOOKMARK_TAG';
export const CLEAR_BOOKMARK_TAG = 'CLEAR_BOOKMARK_TAG';
export const CLEAR_ALL_BOOKMARK_TAG = 'CLEAR_ALL_BOOKMARK_TAG';

export const TagType = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
};

function receiveBookmarkTag(json, tagType, options, offset) { 
  return {
    type: RECEIVE_BOOKMARK_TAG,
    payload: {
      items: json.bookmark_tags.map(tag => {
        return {
          name: tag.name,
          value: tag.name,
          count: tag.count,
        }
      }),
      tagType,
      options,
      offset,
      nextUrl: json.next_url,
      timestamp: Date.now(),
    }
  };
}

function requestBookmarkTag(tagType, options, offset) {
  return {
    type: REQUEST_BOOKMARK_TAG,
    payload: {
      tagType,
      options,
      offset,
    }
  };
}

function stopBookmarkTag(tagType, options, offset) {
  return {
    type: STOP_BOOKMARK_TAG,
    payload: {
      options,
      tagType,
      offset,
    }
  };
}

function shouldFetchBookmarkTag(state, tagType) {
  if (!tagType) {
    return false;
  }
  const results = state.bookmarkTag[tagType];
  if (results && results.loading) {
    return false;
  } else {
    return true;
  }
}

function fetchBookmarkTagFromApi(tagType, nextUrl) {
  let options = {};
  if (!nextUrl) {
    switch (tagType) {
      case TagType.PUBLIC:
        options.restrict = 'public';
        break;
      case TagType.PRIVATE:
        options.restrict = 'private';
        break;
    }
  }
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.userBookmarkIllustTags(options);
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(requestBookmarkTag(tagType, options, offset));
    return promise
      .then(json => {
        dispatch(receiveBookmarkTag(json, tagType, options, offset))
      })
      .catch(err => {
        dispatch(stopBookmarkTag(tagType, options, offset));
        dispatch(addError(err));
      });
  };
}

export function fetchBookmarkTag(tagType, nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchBookmarkTag(getState(), tagType)) {
      return dispatch(fetchBookmarkTagFromApi(tagType, nextUrl));
    }
  };
}

export function clearBookmarkTag(tagType){
  return {
    type: CLEAR_BOOKMARK_TAG,
    payload: {
      tagType
    }
  };
}

export function clearAllBookmarkTag(tagType){
  return {
    type: CLEAR_ALL_BOOKMARK_TAG,
    payload: {
      tagType
    }
  };
}
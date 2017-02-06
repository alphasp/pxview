import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const BOOKMARK_ILLUST = 'BOOKMARK_ILLUST';
export const BOOKMARK_ILLUST_SUCCESS = 'BOOKMARK_ILLUST_SUCCESS';
export const BOOKMARK_ILLUST_FAILURE = 'BOOKMARK_ILLUST_FAILURE';
export const UNBOOKMARK_ILLUST = 'UNBOOKMARK_ILLUST';
export const UNBOOKMARK_ILLUST_SUCCESS = 'UNBOOKMARK_ILLUST_SUCCESS';
export const UNBOOKMARK_ILLUST_FAILURE = 'UNBOOKMARK_ILLUST_FAILURE';

export const BookmarkType = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
};

export const BookmarkActionType = {
  BOOKMARK: 'BOOKMARK',
  UNBOOKMARK: 'UNBOOKMARK'
};

function createBookmarkIllust(illustId, bookmarkType, tags) {
  return {
    type: BOOKMARK_ILLUST,
    payload: {
      illustId,
      bookmarkType,
      tags,
    }
  };
}

function deleteBookmarkIllust(illustId, bookmarkType, tags) {
  return {
    type: UNBOOKMARK_ILLUST,
    payload: {
      illustId,
      bookmarkType,
      tags,
    }
  };
}

function bookmarkIllustSuccess(illustId, bookmarkType, tags) {
  return {
    type: BOOKMARK_ILLUST_SUCCESS,
    payload: {
      illustId, 
      bookmarkType, 
      tags,
      receivedAt: Date.now(),
    }
  };
}

function bookmarkIllustFailure(illustId, bookmarkType, tags) {
  return {
    type: BOOKMARK_ILLUST_FAILURE,
    payload: {
      illustId,
      bookmarkType,
      tags,
    }
  };
}

function unbookmarkIllustSuccess(illustId, bookmarkType, tags) {
  return {
    type: UNBOOKMARK_ILLUST_SUCCESS,
    payload: {
      illustId, 
      bookmarkType, 
      tags,
      receivedAt: Date.now(),
    }
  };
}

function unbookmarkIllustFailure(illustId, bookmarkType, tags) {
  return {
    type: UNBOOKMARK_ILLUST_FAILURE,
    payload: {
      illustId,
      bookmarkType,
      tags,
    }
  };
}

function bookmarkIllustFromApi(illustId, bookmarkActionType, bookmarkType, tags)  {
  const bookmarkTypeString = bookmarkType === BookmarkType.PRIVATE ? 'private' : 'public';
  console.log(illustId, bookmarkActionType, bookmarkTypeString)
  return dispatch => {
    dispatch(
      bookmarkActionType === BookmarkActionType.BOOKMARK ? 
      createBookmarkIllust(illustId, bookmarkType, tags)
      :
      deleteBookmarkIllust(illustId, bookmarkType, tags)
    );
    const promise = 
      bookmarkActionType === BookmarkActionType.BOOKMARK ? 
      pixiv.bookmarkIllust(illustId, bookmarkTypeString, tags)
      : 
      pixiv.unbookmarkIllust(illustId);
    return promise
      .then(json => {
        dispatch(
          bookmarkActionType === BookmarkActionType.BOOKMARK ? 
          bookmarkIllustSuccess(illustId, bookmarkType, tags)
          :
          unbookmarkIllustSuccess(illustId, bookmarkType)
        );
      })
      .catch(err => {
        dispatch(
          bookmarkActionType === BookmarkActionType.BOOKMARK ? 
          bookmarkIllustFailure(illustId, bookmarkType, tags)
          :
          unbookmarkIllustFailure(illustId, bookmarkType, tags)
        );
        dispatch(addError(err));
      });
  };
}

export function bookmarkIllust(illustId, bookmarkType, tags) {
  return (dispatch, getState) => {
    return dispatch(bookmarkIllustFromApi(illustId, BookmarkActionType.BOOKMARK, bookmarkType, tags)); 
  };
}

export function unbookmarkIllust(illustId, bookmarkType, tags) {
  return (dispatch, getState) => {
    return dispatch(bookmarkIllustFromApi(illustId, BookmarkActionType.UNBOOKMARK, bookmarkType, tags));
  };
}
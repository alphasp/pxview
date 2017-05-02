import { BOOKMARK_ILLUST, UNBOOKMARK_ILLUST } from '../constants/actionTypes';

export function bookmarkIllustSuccess(illustId) {
  return {
    type: BOOKMARK_ILLUST.SUCCESS,
    payload: {
      illustId,
      timestamp: Date.now(),
    },
  };
}

export function unbookmarkIllustSuccess(illustId) {
  return {
    type: UNBOOKMARK_ILLUST.SUCCESS,
    payload: {
      illustId,
      timestamp: Date.now(),
    },
  };
}

export function bookmarkIllustFailure(illustId) {
  return {
    type: BOOKMARK_ILLUST.FAILURE,
    payload: {
      illustId,
    },
  };
}

export function unbookmarkIllustFailure(illustId) {
  return {
    type: UNBOOKMARK_ILLUST.FAILURE,
    payload: {
      illustId,
    },
  };
}

export function bookmarkIllust(illustId, bookmarkType, tags) {
  return {
    type: BOOKMARK_ILLUST.REQUEST,
    payload: {
      illustId,
      bookmarkType,
      tags,
    },
  };
}

export function unbookmarkIllust(illustId, tags) {
  return {
    type: UNBOOKMARK_ILLUST.REQUEST,
    payload: {
      illustId,
      tags,
    },
  };
}

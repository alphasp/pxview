import { BOOKMARK_NOVEL, UNBOOKMARK_NOVEL } from '../constants/actionTypes';

export function bookmarkNovelSuccess(novelId) {
  return {
    type: BOOKMARK_NOVEL.SUCCESS,
    payload: {
      novelId,
      timestamp: Date.now(),
    },
  };
}

export function unbookmarkNovelSuccess(novelId) {
  return {
    type: UNBOOKMARK_NOVEL.SUCCESS,
    payload: {
      novelId,
      timestamp: Date.now(),
    },
  };
}

export function bookmarkNovelFailure(novelId) {
  return {
    type: BOOKMARK_NOVEL.FAILURE,
    payload: {
      novelId,
    },
  };
}

export function unbookmarkNovelFailure(novelId) {
  return {
    type: UNBOOKMARK_NOVEL.FAILURE,
    payload: {
      novelId,
    },
  };
}

export function bookmarkNovel(novelId, bookmarkType, tags) {
  return {
    type: BOOKMARK_NOVEL.REQUEST,
    payload: {
      novelId,
      bookmarkType,
      tags,
    },
  };
}

export function unbookmarkNovel(novelId, tags) {
  return {
    type: UNBOOKMARK_NOVEL.REQUEST,
    payload: {
      novelId,
      tags,
    },
  };
}

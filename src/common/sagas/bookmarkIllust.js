import { takeEvery, apply, put, select } from 'redux-saga/effects';
import {
  bookmarkIllustSuccess,
  bookmarkIllustFailure,
  unbookmarkIllustSuccess,
  unbookmarkIllustFailure
} from '../actions/bookmarkIllust.js'
import { addError } from '../actions/error';
import pixiv from '../helpers/ApiClient';
import { BOOKMARK_ILLUST, UNBOOKMARK_ILLUST } from '../constants/actionTypes';
import { BOOKMARK_TYPES } from '../constants/bookmarkTypes';

export function* handleBookmarkIllust(action) {
  const { illustId, bookmarkType, tags } = action.payload;
  try {
    const bookmarkTypeString = bookmarkType === BOOKMARK_TYPES.PRIVATE ? 'private' : 'public';
    const response = yield apply(pixiv, pixiv.bookmarkIllust, [illustId, bookmarkTypeString, tags]);
    yield put(bookmarkIllustSuccess(illustId));
  } 
  catch(err) {
    yield put(bookmarkIllustFailure(illustId));
    yield put(addError(err));    
  }
}

export function* handleUnbookmarkIllust(action) {
  const { illustId, bookmarkType } = action.payload;
  try {
    const bookmarkTypeString = bookmarkType === BOOKMARK_TYPES.PRIVATE ? 'private' : 'public';
    const response = yield apply(pixiv, pixiv.unbookmarkIllust, [illustId]);
    yield put(unbookmarkIllustSuccess(illustId));
  } 
  catch(err) {
    yield put(unbookmarkIllustFailure(illustId));
    yield put(addError(err));    
  }
}

export function* watchBookmarkIllust() {
  yield takeEvery(BOOKMARK_ILLUST.REQUEST, handleBookmarkIllust);
}

export function* watchUnbookmarkIllust() {
  yield takeEvery(UNBOOKMARK_ILLUST.REQUEST, handleUnbookmarkIllust);
}
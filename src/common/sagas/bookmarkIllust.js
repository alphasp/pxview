import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  bookmarkIllustSuccess,
  bookmarkIllustFailure,
  unbookmarkIllustSuccess,
  unbookmarkIllustFailure,
} from '../actions/bookmarkIllust';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { BOOKMARK_ILLUST, UNBOOKMARK_ILLUST } from '../constants/actionTypes';
import { BOOKMARK_TYPES } from '../constants';

export function* handleBookmarkIllust(action) {
  const { illustId, bookmarkType, tags } = action.payload;
  try {
    const bookmarkTypeString = bookmarkType === BOOKMARK_TYPES.PRIVATE ? 'private' : 'public';
    yield apply(pixiv, pixiv.bookmarkIllust, [illustId, bookmarkTypeString, tags]);
    yield put(bookmarkIllustSuccess(illustId));
  }
  catch (err) {
    yield put(bookmarkIllustFailure(illustId));
    yield put(addError(err));
  }
}

export function* handleUnbookmarkIllust(action) {
  const { illustId } = action.payload;
  try {
    yield apply(pixiv, pixiv.unbookmarkIllust, [illustId]);
    yield put(unbookmarkIllustSuccess(illustId));
  }
  catch (err) {
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

import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  bookmarkNovelSuccess,
  bookmarkNovelFailure,
  unbookmarkNovelSuccess,
  unbookmarkNovelFailure,
} from '../actions/bookmarkNovel';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { BOOKMARK_NOVEL, UNBOOKMARK_NOVEL } from '../constants/actionTypes';
import { BOOKMARK_TYPES } from '../constants';

export function* handleBookmarkNovel(action) {
  const { novelId, bookmarkType, tags } = action.payload;
  try {
    const bookmarkTypeString =
      bookmarkType === BOOKMARK_TYPES.PRIVATE ? 'private' : 'public';
    yield apply(pixiv, pixiv.bookmarkNovel, [
      novelId,
      bookmarkTypeString,
      tags,
    ]);
    yield put(bookmarkNovelSuccess(novelId));
  } catch (err) {
    yield put(bookmarkNovelFailure(novelId));
    yield put(addError(err));
  }
}

export function* handleUnbookmarkNovel(action) {
  const { novelId } = action.payload;
  try {
    yield apply(pixiv, pixiv.unbookmarkNovel, [novelId]);
    yield put(unbookmarkNovelSuccess(novelId));
  } catch (err) {
    yield put(unbookmarkNovelFailure(novelId));
    yield put(addError(err));
  }
}

export function* watchBookmarkNovel() {
  yield takeEvery(BOOKMARK_NOVEL.REQUEST, handleBookmarkNovel);
}

export function* watchUnbookmarkNovel() {
  yield takeEvery(UNBOOKMARK_NOVEL.REQUEST, handleUnbookmarkNovel);
}

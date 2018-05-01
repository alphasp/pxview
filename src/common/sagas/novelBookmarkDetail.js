import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchNovelBookmarkDetailSuccess,
  fetchNovelBookmarkDetailFailure,
} from '../actions/novelBookmarkDetail';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { NOVEL_BOOKMARK_DETAIL } from '../constants/actionTypes';

export function* handleFetchNovelBookmarkDetail(action) {
  const { novelId } = action.payload;
  try {
    const response = yield apply(pixiv, pixiv.novelBookmarkDetail, [novelId]);
    yield put(
      fetchNovelBookmarkDetailSuccess(response.bookmark_detail, novelId),
    );
  } catch (err) {
    yield put(fetchNovelBookmarkDetailFailure(novelId));
    yield put(addError(err));
  }
}

export function* watchFetchNovelBookmarkDetail() {
  yield takeEvery(
    NOVEL_BOOKMARK_DETAIL.REQUEST,
    handleFetchNovelBookmarkDetail,
  );
}

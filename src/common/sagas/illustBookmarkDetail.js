import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchIllustBookmarkDetailSuccess,
  fetchIllustBookmarkDetailFailure,
} from '../actions/illustBookmarkDetail';
import { addError } from '../actions/error';
import pixiv from '../helpers/ApiClient';
import { ILLUST_BOOKMARK_DETAIL } from '../constants/actionTypes';

export function* handleFetchIllustBookmarkDetail(action) {
  const { illustId } = action.payload;
  try {
    const response = yield apply(pixiv, pixiv.illustBookmarkDetail, [illustId]);
    yield put(fetchIllustBookmarkDetailSuccess(response.bookmark_detail, illustId));
  }
  catch (err) {
    yield put(fetchIllustBookmarkDetailFailure(illustId));
    yield put(addError(err));
  }
}

export function* watchFetchIllustBookmarkDetail() {
  yield takeEvery(ILLUST_BOOKMARK_DETAIL.REQUEST, handleFetchIllustBookmarkDetail);
}

import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchUgoiraMetaSuccess,
  fetchUgoiraMetaFailure,
} from '../actions/ugoiraMeta';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { UGOIRA_META } from '../constants/actionTypes';

export function* handleFetchIllustBookmarkDetail(action) {
  const { illustId } = action.payload;
  try {
    const response = yield apply(pixiv, pixiv.ugoiraMetaData, [illustId]);
    const metaData = response.ugoira_metadata;
    const item = {
      zipUrl: metaData.zip_urls.medium,
      frames: metaData.frames,
    };
    yield put(fetchUgoiraMetaSuccess(item, illustId));
  } catch (err) {
    yield put(fetchUgoiraMetaFailure(illustId));
    yield put(addError(err));
  }
}

export function* watchFetchUgoiraMeta() {
  yield takeEvery(UGOIRA_META.REQUEST, handleFetchIllustBookmarkDetail);
}

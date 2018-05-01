import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchNovelDetailSuccess,
  fetchNovelDetailFailure,
} from '../actions/novelDetail';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { NOVEL_DETAIL } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchNovelDetail(action) {
  const { novelId } = action.payload;
  try {
    const response = yield apply(pixiv, pixiv.novelDetail, [novelId]);
    const normalized = normalize(response.novel, Schemas.NOVEL);
    yield put(
      fetchNovelDetailSuccess(normalized.entities, normalized.result, novelId),
    );
  } catch (err) {
    yield put(fetchNovelDetailFailure(novelId));
    yield put(addError(err));
  }
}

export function* watchFetchNovelDetail() {
  yield takeEvery(NOVEL_DETAIL.REQUEST, handleFetchNovelDetail);
}

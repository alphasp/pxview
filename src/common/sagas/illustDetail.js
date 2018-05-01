import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchIllustDetailSuccess,
  fetchIllustDetailFailure,
} from '../actions/illustDetail';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { ILLUST_DETAIL } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchIllustDetail(action) {
  const { illustId } = action.payload;
  try {
    const response = yield apply(pixiv, pixiv.illustDetail, [illustId]);
    const normalized = normalize(response.illust, Schemas.ILLUST);
    yield put(
      fetchIllustDetailSuccess(
        normalized.entities,
        normalized.result,
        illustId,
      ),
    );
  } catch (err) {
    yield put(fetchIllustDetailFailure(illustId));
    yield put(addError(err));
  }
}

export function* watchFetchIllustDetail() {
  yield takeEvery(ILLUST_DETAIL.REQUEST, handleFetchIllustDetail);
}

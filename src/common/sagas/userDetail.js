import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchUserDetailSuccess,
  fetchUserDetailFailure,
} from '../actions/userDetail.js';
import { addError } from '../actions/error';
import pixiv from '../helpers/ApiClient';
import { USER_DETAIL } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchUserDetail(action) {
  const { userId } = action.payload;
  try {
    const response = yield apply(pixiv, pixiv.userDetail, [userId]);
    const transformedResult = {
      ...response,
      id: response.user.id,
    };
    const normalized = normalize(transformedResult, Schemas.USER_PROFILE);
    yield put(fetchUserDetailSuccess(normalized.entities, normalized.result, userId));
  }
  catch (err) {
    yield put(fetchUserDetailFailure(userId));
    yield put(addError(err));
  }
}

export function* watchFetchUserDetail() {
  yield takeEvery(USER_DETAIL.REQUEST, handleFetchUserDetail);
}

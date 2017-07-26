import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchMyAccountStateSuccess,
  fetchMyAccountStateFailure,
} from '../actions/myAccountState';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { MY_ACCOUNT_STATE } from '../constants/actionTypes';

export function* handleFetchMyAccountState() {
  try {
    const response = yield apply(pixiv, pixiv.userState);
    yield put(fetchMyAccountStateSuccess(response.user_state));
  } catch (err) {
    yield put(fetchMyAccountStateFailure());
    yield put(addError(err));
  }
}

export function* watchFetchMyAccountState() {
  yield takeEvery(MY_ACCOUNT_STATE.REQUEST, handleFetchMyAccountState);
}

import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchUserFollowDetailSuccess,
  fetchUserFollowDetailFailure,
} from '../actions/userFollowDetail';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { USER_FOLLOW_DETAIL } from '../constants/actionTypes';

export function* handleFetchUserFollowDetail(action) {
  const { userId } = action.payload;
  try {
    const response = yield apply(pixiv, pixiv.userFollowDetail, [userId]);
    yield put(fetchUserFollowDetailSuccess(response.follow_detail, userId));
  }
  catch (err) {
    yield put(fetchUserFollowDetailFailure(userId));
    yield put(addError(err));
  }
}

export function* watchFetchUserFollowDetail() {
  yield takeEvery(USER_FOLLOW_DETAIL.REQUEST, handleFetchUserFollowDetail);
}

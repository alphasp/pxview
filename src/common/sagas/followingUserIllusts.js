import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchFollowingUserIllustsSuccess,
  fetchFollowingUserIllustsFailure,
} from '../actions/followingUserIllusts';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { FOLLOWING_USER_ILLUSTS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchFollowingUserIllusts(action) {
  const { nextUrl, options } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    }
    else {
      response = yield apply(pixiv, pixiv.illustFollow, [options]);
    }
    const normalized = normalize(response.illusts, Schemas.ILLUST_ARRAY);
    // eslint-disable-next-line max-len
    yield put(fetchFollowingUserIllustsSuccess(normalized.entities, normalized.result, response.next_url));
  }
  catch (err) {
    yield put(fetchFollowingUserIllustsFailure());
    yield put(addError(err));
  }
}

export function* watchFetchFollowingUserIllusts() {
  yield takeEvery(FOLLOWING_USER_ILLUSTS.REQUEST, handleFetchFollowingUserIllusts);
}

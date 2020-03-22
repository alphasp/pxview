import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchFollowingUserNovelsSuccess,
  fetchFollowingUserNovelsFailure,
} from '../actions/followingUserNovels';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { FOLLOWING_USER_NOVELS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchFollowingUserNovels(action) {
  const { nextUrl, options } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      response = yield apply(pixiv, pixiv.novelFollow, [options]);
    }
    const normalized = normalize(
      response.novels.filter((illust) => illust.visible && illust.id),
      Schemas.NOVEL_ARRAY,
    );
    // eslint-disable-next-line max-len
    yield put(
      fetchFollowingUserNovelsSuccess(
        normalized.entities,
        normalized.result,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchFollowingUserNovelsFailure());
    yield put(addError(err));
  }
}

export function* watchFetchFollowingUserNovels() {
  yield takeEvery(
    FOLLOWING_USER_NOVELS.REQUEST,
    handleFetchFollowingUserNovels,
  );
}

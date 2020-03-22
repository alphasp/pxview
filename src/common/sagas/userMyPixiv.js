import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchUserMyPixivSuccess,
  fetchUserMyPixivFailure,
} from '../actions/userMyPixiv';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { USER_MY_PIXIV } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchUserMyPixiv(action) {
  const { userId, nextUrl } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      response = yield apply(pixiv, pixiv.userMyPixiv, [userId]);
    }
    const transformedResult = {
      ...response,
      user_previews: response.user_previews.map((result) => ({
        ...result,
        id: result.user.id,
      })),
    };
    const normalized = normalize(
      transformedResult.user_previews,
      Schemas.USER_PREVIEW_ARRAY,
    );
    yield put(
      fetchUserMyPixivSuccess(
        normalized.entities,
        normalized.result,
        userId,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchUserMyPixivFailure(userId));
    yield put(addError(err));
  }
}

export function* watchFetchUserMyPixiv() {
  yield takeEvery(USER_MY_PIXIV.REQUEST, handleFetchUserMyPixiv);
}

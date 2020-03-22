import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchRecommendedUsersSuccess,
  fetchRecommendedUsersFailure,
} from '../actions/recommendedUsers';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { RECOMMENDED_USERS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchRecommendedUsers(action) {
  const { options, nextUrl } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      response = yield apply(pixiv, pixiv.userRecommended, [options]);
    }
    const transformedResult = {
      ...response,
      user_previews: response.user_previews
        .filter((result) => result.illusts && result.illusts.length)
        .map((result) => ({
          ...result,
          id: result.user.id,
        })),
    };
    const normalized = normalize(
      transformedResult.user_previews,
      Schemas.USER_PREVIEW_ARRAY,
    );
    yield put(
      fetchRecommendedUsersSuccess(
        normalized.entities,
        normalized.result,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchRecommendedUsersFailure());
    yield put(addError(err));
  }
}

export function* watchFetchRecommendedUsers() {
  yield takeEvery(RECOMMENDED_USERS.REQUEST, handleFetchRecommendedUsers);
}

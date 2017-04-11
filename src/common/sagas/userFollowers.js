import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchUserFollowersSuccess,
  fetchUserFollowersFailure,
} from '../actions/userFollowers.js'
import { addError } from '../actions/error';
import pixiv from '../helpers/ApiClient';
import { USER_FOLLOWERS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchUserFollowers(action) {
  const { userId, nextUrl } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    }
    else {
      response = yield apply(pixiv, pixiv.userFollower, [userId]);
    }
    const transformedResult = {
      ...response,
      user_previews: response.user_previews.map(result => {
        return {
          ...result,
          id: result.user.id
        }
      })
    };
    const normalized = normalize(transformedResult.user_previews, Schemas.USER_PREVIEW_ARRAY);
    yield put(fetchUserFollowersSuccess(normalized.entities, normalized.result, userId, response.next_url));
  } 
  catch(err) {
    yield put(fetchUserFollowersFailure(userId));
    yield put(addError(err));    
  }
}

export function* watchFetchUserFollowers() {
  yield takeEvery(USER_FOLLOWERS.REQUEST, handleFetchUserFollowers);
}
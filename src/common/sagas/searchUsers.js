import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchSearchUsersSuccess,
  fetchSearchUsersFailure,
} from '../actions/searchUsers.js';
import { addError } from '../actions/error';
import pixiv from '../helpers/ApiClient';
import { SEARCH_USERS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchSearchUsers(action) {
  const { navigationStateKey, word, nextUrl } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    }
    else {
      response = yield apply(pixiv, pixiv.searchUser, [word]);
    }
    const transformedResult = {
      ...response,
      user_previews: response.user_previews.filter(user => user.illusts && user.illusts.length).map(result => ({
        ...result,
        id: result.user.id,
      })),
    };
    const normalized = normalize(transformedResult.user_previews, Schemas.USER_PREVIEW_ARRAY);
    yield put(fetchSearchUsersSuccess(normalized.entities, normalized.result, navigationStateKey, response.next_url));
  }
  catch (err) {
    yield put(fetchSearchUsersFailure(navigationStateKey));
    yield put(addError(err));
  }
}

export function* watchFetchSearchUsers() {
  yield takeEvery(SEARCH_USERS.REQUEST, handleFetchSearchUsers);
}

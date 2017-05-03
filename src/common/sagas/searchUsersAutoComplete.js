import { normalize } from 'normalizr';
import { throttle, apply, put } from 'redux-saga/effects';
import {
  fetchSearchUsersAutoCompleteSuccess,
  fetchSearchUsersAutoCompleteFailure,
} from '../actions/searchUsersAutoComplete';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { SEARCH_USERS_AUTOCOMPLETE } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchSearchUsersAutoComplete(action) {
  const { word, nextUrl } = action.payload;
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
      user_previews: response.user_previews
        .filter(result => result.illusts && result.illusts.length)
        .map(result => ({
          ...result,
          id: result.user.id,
        })),
    };
    const normalized = normalize(transformedResult.user_previews, Schemas.USER_PREVIEW_ARRAY);
    yield put(fetchSearchUsersAutoCompleteSuccess(
      normalized.entities,
      normalized.result,
      response.next_url,
    ));
  }
  catch (err) {
    yield put(fetchSearchUsersAutoCompleteFailure());
    yield put(addError(err));
  }
}

export function* watchFetchSearchUsersAutoComplete() {
  yield throttle(1000, SEARCH_USERS_AUTOCOMPLETE.REQUEST, handleFetchSearchUsersAutoComplete);
}

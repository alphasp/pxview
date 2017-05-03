import { throttle, apply, put } from 'redux-saga/effects';
import {
  fetchSearchAutoCompleteSuccess,
  fetchSearchAutoCompleteFailure,
} from '../actions/searchAutoComplete';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { SEARCH_AUTOCOMPLETE } from '../constants/actionTypes';

export function* handleFetchSearchAutoComplete(action) {
  const { word } = action.payload;
  try {
    const response = yield apply(pixiv, pixiv.searchAutoComplete, [word]);
    yield put(fetchSearchAutoCompleteSuccess(response.search_auto_complete_keywords));
  }
  catch (err) {
    yield put(fetchSearchAutoCompleteFailure());
    yield put(addError(err));
  }
}

export function* watchFetchSearchAutoComplete() {
  yield throttle(1000, SEARCH_AUTOCOMPLETE.REQUEST, handleFetchSearchAutoComplete);
}

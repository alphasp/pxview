import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import { fetchSearchSuccess, fetchSearchFailure } from '../actions/search';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { SEARCH } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchSearch(action) {
  const { navigationStateKey, word, options, nextUrl } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      let finalOptions;
      if (options) {
        finalOptions = Object.keys(options)
          .filter(key => options[key])
          .reduce((prev, key) => {
            prev[key] = options[key];
            return prev;
          }, {});
      }
      response = yield apply(pixiv, pixiv.searchIllust, [word, finalOptions]);
    }
    const normalized = normalize(
      response.illusts.filter(illust => illust.visible),
      Schemas.ILLUST_ARRAY,
    );
    yield put(
      fetchSearchSuccess(
        normalized.entities,
        normalized.result,
        navigationStateKey,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchSearchFailure(navigationStateKey));
    yield put(addError(err));
  }
}

export function* watchFetchSearch() {
  yield takeEvery(SEARCH.REQUEST, handleFetchSearch);
}

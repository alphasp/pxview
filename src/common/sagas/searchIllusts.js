import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchSearchIllustsSuccess,
  fetchSearchIllustsFailure,
} from '../actions/searchIllusts';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { SEARCH_ILLUSTS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchSearchIllusts(action) {
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
      response.illusts.filter(illust => illust.visible && illust.id),
      Schemas.ILLUST_ARRAY,
    );
    yield put(
      fetchSearchIllustsSuccess(
        normalized.entities,
        normalized.result,
        navigationStateKey,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchSearchIllustsFailure(navigationStateKey));
    yield put(addError(err));
  }
}

export function* watchFetchSearchIllusts() {
  yield takeEvery(SEARCH_ILLUSTS.REQUEST, handleFetchSearchIllusts);
}

import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchSearchNovelsSuccess,
  fetchSearchNovelsFailure,
} from '../actions/searchNovels';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { SEARCH_NOVELS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchSearchNovels(action) {
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
      response = yield apply(pixiv, pixiv.searchNovel, [word, finalOptions]);
    }
    const normalized = normalize(
      response.novels.filter(novel => novel.visible && novel.id),
      Schemas.NOVEL_ARRAY,
    );
    yield put(
      fetchSearchNovelsSuccess(
        normalized.entities,
        normalized.result,
        navigationStateKey,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchSearchNovelsFailure(navigationStateKey));
    yield put(addError(err));
  }
}

export function* watchFetchSearchNovels() {
  yield takeEvery(SEARCH_NOVELS.REQUEST, handleFetchSearchNovels);
}

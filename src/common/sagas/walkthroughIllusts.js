import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchWalkthroughIllustsSuccess,
  fetchWalkthroughIllustsFailure,
} from '../actions/walkthroughIllusts';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { WALKTHROUGH_ILLUSTS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchWalkthroughIllusts(action) {
  const { nextUrl, options } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      response = yield apply(pixiv, pixiv.illustWalkthrough, [options]);
    }
    const normalized = normalize(
      response.illusts.filter(illust => illust.visible),
      Schemas.ILLUST_ARRAY,
    );
    yield put(
      fetchWalkthroughIllustsSuccess(normalized.entities, normalized.result),
    );
  } catch (err) {
    yield put(fetchWalkthroughIllustsFailure());
    yield put(addError(err));
  }
}

export function* watchFetchWalkthroughIllusts() {
  yield takeEvery(WALKTHROUGH_ILLUSTS.REQUEST, handleFetchWalkthroughIllusts);
}

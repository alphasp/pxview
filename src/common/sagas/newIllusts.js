import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchNewIllustsSuccess,
  fetchNewIllustsFailure,
} from '../actions/newIllusts';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { NEW_ILLUSTS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchNewIllusts(action) {
  const { nextUrl, options } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      response = yield apply(pixiv, pixiv.illustNew, [options]);
    }
    const normalized = normalize(
      response.illusts.filter(illust => illust.visible && illust.id),
      Schemas.ILLUST_ARRAY,
    );
    yield put(
      fetchNewIllustsSuccess(
        normalized.entities,
        normalized.result,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchNewIllustsFailure());
    yield put(addError(err));
  }
}

export function* watchFetchNewIllusts() {
  yield takeEvery(NEW_ILLUSTS.REQUEST, handleFetchNewIllusts);
}

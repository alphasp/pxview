import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchRelatedIllustsSuccess,
  fetchRelatedIllustsFailure,
} from '../actions/relatedIllusts';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { RELATED_ILLUSTS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchRelatedIllusts(action) {
  const { illustId, options, nextUrl } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      response = yield apply(pixiv, pixiv.illustRelated, [illustId, options]);
    }
    const normalized = normalize(
      response.illusts.filter(illust => illust.visible),
      Schemas.ILLUST_ARRAY,
    );
    yield put(
      fetchRelatedIllustsSuccess(
        normalized.entities,
        normalized.result,
        illustId,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchRelatedIllustsFailure(illustId));
    yield put(addError(err));
  }
}

export function* watchFetchRelatedIllusts() {
  yield takeEvery(RELATED_ILLUSTS.REQUEST, handleFetchRelatedIllusts);
}

// function shouldFetchRelatedIllust(state, illustId) {
//   if (!illustId) {
//     return false;
//   }
//   const results = state.relatedIllusts[illustId];
//   if (results && results.loading) {
//     return false;
//   } else {
//     return true;
//   }
// }

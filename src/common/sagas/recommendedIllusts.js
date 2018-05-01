import { normalize } from 'normalizr';
import { takeLatest, apply, put } from 'redux-saga/effects';
import {
  fetchRecommendedIllustsSuccess,
  fetchRecommendedIllustsFailure,
} from '../actions/recommendedIllusts';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { RECOMMENDED_ILLUSTS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchRecommendedIllusts(action) {
  try {
    const { options, nextUrl } = action.payload;
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      response = yield apply(pixiv, pixiv.illustRecommended, [options]);
    }
    const normalized = normalize(
      response.illusts.filter(illust => illust.visible && illust.id),
      Schemas.ILLUST_ARRAY,
    );
    yield put(
      fetchRecommendedIllustsSuccess(
        normalized.entities,
        normalized.result,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchRecommendedIllustsFailure());
    yield put(addError(err));
  }
}

export function* watchFetchRecommendedIllusts() {
  yield takeLatest(RECOMMENDED_ILLUSTS.REQUEST, handleFetchRecommendedIllusts);
}

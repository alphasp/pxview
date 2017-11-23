import { normalize } from 'normalizr';
import { takeLatest, apply, put } from 'redux-saga/effects';
import {
  fetchRecommendedNovelsSuccess,
  fetchRecommendedNovelsFailure,
} from '../actions/recommendedNovels';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { RECOMMENDED_NOVELS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchRecommendedNovels(action) {
  try {
    const { options, nextUrl } = action.payload;
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      response = yield apply(pixiv, pixiv.novelRecommended, [options]);
    }
    const normalized = normalize(
      response.novels.filter(novel => novel.visible && novel.id),
      Schemas.NOVEL_ARRAY,
    );
    yield put(
      fetchRecommendedNovelsSuccess(
        normalized.entities,
        normalized.result,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchRecommendedNovelsFailure());
    yield put(addError(err));
  }
}

export function* watchFetchRecommendedNovels() {
  yield takeLatest(RECOMMENDED_NOVELS.REQUEST, handleFetchRecommendedNovels);
}

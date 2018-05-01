import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchNovelSeriesSuccess,
  fetchNovelSeriesFailure,
} from '../actions/novelSeries';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { NOVEL_SERIES } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchNovelSeries(action) {
  const { seriesId, options, nextUrl } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      response = yield apply(pixiv, pixiv.novelSeries, [seriesId, options]);
    }
    //
    const normalized = normalize(
      response.novels.filter(novel => novel.visible && novel.id),
      Schemas.NOVEL_ARRAY,
    );
    yield put(
      fetchNovelSeriesSuccess(
        normalized.entities,
        normalized.result,
        seriesId,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchNovelSeriesFailure(seriesId));
    yield put(addError(err));
  }
}

export function* watchFetchNovelSeries() {
  yield takeEvery(NOVEL_SERIES.REQUEST, handleFetchNovelSeries);
}

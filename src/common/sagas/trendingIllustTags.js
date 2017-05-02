import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchTrendingIllustTagsSuccess,
  fetchTrendingIllustTagsFailure,
} from '../actions/trendingIllustTags';
import { addError } from '../actions/error';
import pixiv from '../helpers/ApiClient';
import { TRENDING_ILLUST_TAGS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchTrendingIllustTags(action) {
  const { options } = action.payload;
  try {
    const response = yield apply(pixiv, pixiv.trendingTagsIllust, [options]);
    const normalized = normalize(response.trend_tags, Schemas.ILLUST_TAG_ARRAY);
    yield put(fetchTrendingIllustTagsSuccess(normalized.entities, normalized.result));
  }
  catch (err) {
    yield put(fetchTrendingIllustTagsFailure());
    yield put(addError(err));
  }
}

export function* watchFetchTrendingIllustTags() {
  yield takeEvery(TRENDING_ILLUST_TAGS.REQUEST, handleFetchTrendingIllustTags);
}

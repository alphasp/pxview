import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchTrendingNovelTagsSuccess,
  fetchTrendingNovelTagsFailure,
} from '../actions/trendingNovelTags';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { TRENDING_NOVEL_TAGS } from '../constants/actionTypes';
import Schemas from '../constants/schemas';

export function* handleFetchTrendingNovelTags(action) {
  const { options } = action.payload;
  try {
    const response = yield apply(pixiv, pixiv.trendingTagsNovel, [options]);
    const normalized = normalize(response.trend_tags, Schemas.ILLUST_TAG_ARRAY);
    yield put(
      fetchTrendingNovelTagsSuccess(normalized.entities, normalized.result),
    );
  } catch (err) {
    yield put(fetchTrendingNovelTagsFailure());
    yield put(addError(err));
  }
}

export function* watchFetchTrendingNovelTags() {
  yield takeEvery(TRENDING_NOVEL_TAGS.REQUEST, handleFetchTrendingNovelTags);
}

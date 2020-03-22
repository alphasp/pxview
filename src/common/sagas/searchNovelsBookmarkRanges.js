import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchSearchNovelsBookmarkRangesSuccess,
  fetchSearchNovelsBookmarkRangesFailure,
} from '../actions/searchNovelsBookmarkRanges';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { SEARCH_NOVELS_BOOKMARK_RANGES } from '../constants/actionTypes';
import { SEARCH_PERIOD_TYPES } from '../constants';
import mapSearchPeriodToStartAndEndDates from '../helpers/searchPeriod';

export function* handleFetchSearchNovelsBookmarkRanges(action) {
  const { navigationStateKey, word, options } = action.payload;
  try {
    let finalOptions;
    if (options) {
      finalOptions = Object.keys(options)
        .filter((key) => options[key] && key !== 'period')
        .reduce((prev, key) => {
          prev[key] = options[key];
          return prev;
        }, {});
      if (
        !options.start_date &&
        !options.end_date &&
        options.period &&
        options.period !== SEARCH_PERIOD_TYPES.ALL
      ) {
        finalOptions = {
          ...finalOptions,
          ...mapSearchPeriodToStartAndEndDates(options.period),
        };
      }
    }
    const response = yield apply(pixiv, pixiv.searchNovelBookmarkRanges, [
      word,
      finalOptions,
    ]);
    yield put(
      fetchSearchNovelsBookmarkRangesSuccess(
        response.bookmark_ranges,
        navigationStateKey,
      ),
    );
  } catch (err) {
    yield put(fetchSearchNovelsBookmarkRangesFailure(navigationStateKey));
    yield put(addError(err));
  }
}

export function* watchFetchSearchNovelsBookmarkRanges() {
  yield takeEvery(
    SEARCH_NOVELS_BOOKMARK_RANGES.REQUEST,
    handleFetchSearchNovelsBookmarkRanges,
  );
}

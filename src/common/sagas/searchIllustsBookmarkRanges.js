import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchSearchIllustsBookmarkRangesSuccess,
  fetchSearchIllustsBookmarkRangesFailure,
} from '../actions/searchIllustsBookmarkRanges';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { SEARCH_ILLUSTS_BOOKMARK_RANGES } from '../constants/actionTypes';
import { SEARCH_PERIOD_TYPES } from '../constants';
import mapSearchPeriodToStartAndEndDates from '../helpers/searchPeriod';

export function* handleFetchSearchIllustsBookmarkRanges(action) {
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
    const response = yield apply(pixiv, pixiv.searchIllustBookmarkRanges, [
      word,
      finalOptions,
    ]);
    yield put(
      fetchSearchIllustsBookmarkRangesSuccess(
        response.bookmark_ranges,
        navigationStateKey,
      ),
    );
  } catch (err) {
    yield put(fetchSearchIllustsBookmarkRangesFailure(navigationStateKey));
    yield put(addError(err));
  }
}

export function* watchFetchSearchIllustsBookmarkRanges() {
  yield takeEvery(
    SEARCH_ILLUSTS_BOOKMARK_RANGES.REQUEST,
    handleFetchSearchIllustsBookmarkRanges,
  );
}

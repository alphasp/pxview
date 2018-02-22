import { normalize } from 'normalizr';
import moment from 'moment';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchSearchNovelsSuccess,
  fetchSearchNovelsFailure,
} from '../actions/searchNovels';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { SEARCH_NOVELS } from '../constants/actionTypes';
import { SEARCH_PERIOD_TYPES } from '../constants';
import Schemas from '../constants/schemas';

const mapPeriodToStartAndEndDates = period => {
  const startDate = moment().subtract(1, 'day');
  const endDate = startDate.clone();
  switch (period) {
    case SEARCH_PERIOD_TYPES.LAST_WEEK:
      startDate.subtract(1, 'week');
      break;
    case SEARCH_PERIOD_TYPES.LAST_MONTH:
      startDate.subtract(1, 'month');
      break;
    case SEARCH_PERIOD_TYPES.LAST_HALF_YEAR:
      startDate.subtract(6, 'month');
      break;
    case SEARCH_PERIOD_TYPES.LAST_YEAR:
      startDate.subtract(1, 'year');
      break;
    case SEARCH_PERIOD_TYPES.LAST_DAY:
    default:
      break;
  }
  return {
    start_date: startDate.format('YYYY-MM-DD'),
    end_date: endDate.format('YYYY-MM-DD'),
  };
};

export function* handleFetchSearchNovels(action) {
  const { navigationStateKey, word, options, nextUrl } = action.payload;
  try {
    let response;
    let normalized;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
      normalized = normalize(
        response.novels.filter(novel => novel.visible && novel.id),
        Schemas.NOVEL_ARRAY,
      );
    } else {
      let finalOptions;
      if (options) {
        finalOptions = Object.keys(options)
          .filter(key => options[key] && key !== 'period')
          .reduce((prev, key) => {
            prev[key] = options[key];
            return prev;
          }, {});
        if (!options.start_date && !options.end_date && options.period) {
          finalOptions = {
            ...finalOptions,
            ...mapPeriodToStartAndEndDates(options.period),
          };
        }
      }
      response = yield apply(pixiv, pixiv.searchNovel, [word, finalOptions]);
      normalized = normalize(
        response.novels.filter(novel => novel.visible && novel.id),
        Schemas.NOVEL_ARRAY,
      );
      if (!response.novels || !response.novels.length) {
        // check if keyword is number, if is number, try to search illust by id
        const novelId = parseInt(word, 10);
        if (novelId) {
          response = yield apply(pixiv, pixiv.novelDetail, [novelId]);
          if (response.novel && response.novel.visible && response.novel.id) {
            normalized = normalize([response.novel], Schemas.NOVEL_ARRAY);
          }
        }
      }
    }
    yield put(
      fetchSearchNovelsSuccess(
        normalized.entities,
        normalized.result,
        navigationStateKey,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchSearchNovelsFailure(navigationStateKey));
    yield put(addError(err));
  }
}

export function* watchFetchSearchNovels() {
  yield takeEvery(SEARCH_NOVELS.REQUEST, handleFetchSearchNovels);
}

import { normalize } from 'normalizr';
import moment from 'moment';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchSearchIllustsSuccess,
  fetchSearchIllustsFailure,
} from '../actions/searchIllusts';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { SEARCH_ILLUSTS } from '../constants/actionTypes';
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

export function* handleFetchSearchIllusts(action) {
  const { navigationStateKey, word, options, nextUrl } = action.payload;
  try {
    let response;
    let normalized;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
      normalized = normalize(
        response.illusts.filter(illust => illust.visible && illust.id),
        Schemas.ILLUST_ARRAY,
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
        if (
          !options.start_date &&
          !options.end_date &&
          options.period &&
          options.period !== SEARCH_PERIOD_TYPES.ALL
        ) {
          finalOptions = {
            ...finalOptions,
            ...mapPeriodToStartAndEndDates(options.period),
          };
        }
      }
      if (options.sort && options.sort === 'popularity') {
        delete finalOptions.sort;
        console.log('search popular illust ', finalOptions);
        response = yield apply(pixiv, pixiv.searchIllustPopularPreview, [
          word,
          finalOptions,
        ]);
      } else {
        response = yield apply(pixiv, pixiv.searchIllust, [word, finalOptions]);
      }
      normalized = normalize(
        response.illusts.filter(illust => illust.visible && illust.id),
        Schemas.ILLUST_ARRAY,
      );
      if (!response.illusts || !response.illusts.length) {
        // check if keyword is number, if is number, try to search illust by id
        const illustId = parseInt(word, 10);
        if (illustId) {
          response = yield apply(pixiv, pixiv.illustDetail, [illustId]);
          if (
            response.illust &&
            response.illust.visible &&
            response.illust.id
          ) {
            normalized = normalize([response.illust], Schemas.ILLUST_ARRAY);
          }
        }
      }
    }

    yield put(
      fetchSearchIllustsSuccess(
        normalized.entities,
        normalized.result,
        navigationStateKey,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchSearchIllustsFailure(navigationStateKey));
    yield put(addError(err));
  }
}

export function* watchFetchSearchIllusts() {
  yield takeEvery(SEARCH_ILLUSTS.REQUEST, handleFetchSearchIllusts);
}

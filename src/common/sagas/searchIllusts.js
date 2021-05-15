import { normalize } from 'normalizr';
import { takeEvery, apply, put, select } from 'redux-saga/effects';
import {
  fetchSearchIllustsSuccess,
  fetchSearchIllustsFailure,
} from '../actions/searchIllusts';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { SEARCH_ILLUSTS } from '../constants/actionTypes';
import { SEARCH_PERIOD_TYPES } from '../constants';
import Schemas from '../constants/schemas';
import { getAuthUser } from '../selectors';
import mapSearchPeriodToStartAndEndDates from '../helpers/searchPeriod';

export function* handleFetchSearchIllusts(action) {
  const { navigationStateKey, word, options, nextUrl } = action.payload;
  try {
    let response;
    let normalized;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
      normalized = normalize(
        response.illusts.filter((illust) => illust.visible && illust.id),
        Schemas.ILLUST_ARRAY,
      );
    } else {
      const searchWord = options?.bookmarkCountsTag
        ? `${word} ${options.bookmarkCountsTag}`
        : word;
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
      const user = yield select(getAuthUser);
      if (options.sort && options.sort === 'popularity') {
        if (user.is_premium) {
          finalOptions.sort = 'popular_desc';
          response = yield apply(pixiv, pixiv.searchIllust, [
            searchWord,
            finalOptions,
          ]);
        } else {
          delete finalOptions.sort;
          response = yield apply(pixiv, pixiv.searchIllustPopularPreview, [
            searchWord,
            finalOptions,
          ]);
        }
      } else {
        response = yield apply(pixiv, pixiv.searchIllust, [
          searchWord,
          finalOptions,
        ]);
      }
      normalized = normalize(
        response.illusts.filter((illust) => illust.visible && illust.id),
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

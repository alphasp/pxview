import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import {
  fetchRankingSuccess,
  fetchRankingFailure,
} from '../actions/ranking';
import { addError } from '../actions/error';
import pixiv from '../helpers/ApiClient';
import { RANKING } from '../constants/actionTypes';
import { RANKING_FOR_UI } from '../constants';
import Schemas from '../constants/schemas';

function mapRankingMode(rankingMode) {
  switch (rankingMode) {
    case RANKING_FOR_UI.DAILY:
      return 'day';
    case RANKING_FOR_UI.DAILY_MALE:
      return 'day_male';
    case RANKING_FOR_UI.DAILY_FEMALE:
      return 'day_female';
    case RANKING_FOR_UI.WEEKLY_ORIGINAL:
      return 'week_original';
    case RANKING_FOR_UI.WEEKLY_ROOKIE:
      return 'week_rookie';
    case RANKING_FOR_UI.WEEKLY:
      return 'week';
    case RANKING_FOR_UI.MONTHLY:
      return 'month';
    default:
      return null;
  }
}

export function* handleFetchRanking(action) {
  const { rankingMode, options, nextUrl } = action.payload;
  try {
    const mode = mapRankingMode(rankingMode);
    const finalOptions = { ...options };
    if (mode) {
      finalOptions.mode = mode;
    }
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    }
    else {
      response = yield apply(pixiv, pixiv.illustRanking, [finalOptions]);
    }
    const normalized = normalize(response.illusts, Schemas.ILLUST_ARRAY);
    yield put(fetchRankingSuccess(
      normalized.entities,
      normalized.result,
      rankingMode,
      response.next_url,
    ));
  }
  catch (err) {
    yield put(fetchRankingFailure(rankingMode));
    yield put(addError(err));
  }
}

export function* watchFetchRanking() {
  yield takeEvery(RANKING.REQUEST, handleFetchRanking);
}

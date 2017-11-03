import { normalize } from 'normalizr';
import { takeEvery, apply, put } from 'redux-saga/effects';
import { fetchRankingSuccess, fetchRankingFailure } from '../actions/ranking';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { RANKING } from '../constants/actionTypes';
import { RANKING_FOR_UI } from '../constants';
import Schemas from '../constants/schemas';

function mapRankingMode(rankingMode) {
  switch (rankingMode) {
    // Illust
    case RANKING_FOR_UI.DAILY_ILLUST:
      return 'day';
    case RANKING_FOR_UI.DAILY_MALE_ILLUST:
      return 'day_male';
    case RANKING_FOR_UI.DAILY_FEMALE_ILLUST:
      return 'day_female';
    case RANKING_FOR_UI.WEEKLY_ORIGINAL_ILLUST:
      return 'week_original';
    case RANKING_FOR_UI.WEEKLY_ROOKIE_ILLUST:
      return 'week_rookie';
    case RANKING_FOR_UI.WEEKLY_ILLUST:
      return 'week';
    case RANKING_FOR_UI.MONTHLY_ILLUST:
      return 'month';
    // Manga
    case RANKING_FOR_UI.DAILY_MANGA:
      return 'day_manga';
    case RANKING_FOR_UI.WEEKLY_MANGA:
      return 'week_manga';
    case RANKING_FOR_UI.MONTHLY_MANGA:
      return 'month_manga';
    case RANKING_FOR_UI.WEEKLY_ROOKIE_MANGA:
      return 'week_rookie_manga';
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
    } else {
      response = yield apply(pixiv, pixiv.illustRanking, [finalOptions]);
    }
    const normalized = normalize(
      response.illusts.filter(illust => illust.visible && illust.id),
      Schemas.ILLUST_ARRAY,
    );
    yield put(
      fetchRankingSuccess(
        normalized.entities,
        normalized.result,
        rankingMode,
        response.next_url,
      ),
    );
  } catch (err) {
    yield put(fetchRankingFailure(rankingMode));
    yield put(addError(err));
  }
}

export function* watchFetchRanking() {
  yield takeEvery(RANKING.REQUEST, handleFetchRanking);
}

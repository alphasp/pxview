import qs from "qs";
import { normalize } from 'normalizr';
import { addError } from './error';
import pixiv from '../helpers/ApiClient';
import Schemas from '../constants/schemas';

export const REQUEST_RANKING = 'REQUEST_RANKING';
export const RECEIVE_RANKING = 'RECEIVE_RANKING';
export const STOP_RANKING = 'STOP_RANKING';
export const CLEAR_RANKING = 'CLEAR_RANKING';
export const CLEAR_ALL_RANKING = 'CLEAR_ALL_RANKING';

export const RankingMode = {
  DAILY: 'DAILY',
  DAILY_MALE: 'DAILY_MALE',
  DAILY_FEMALE: 'DAILY_FEMALE',
  WEEKLY_ORIGINAL: 'WEEKLY_ORIGINAL',
  WEEKLY_ROOKIE: 'WEEKLY_ROOKIE',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  PAST: 'PAST'
};

function receiveRanking(normalized, nextUrl, rankingMode, options, offset) { 
  return {
    type: RECEIVE_RANKING,
    payload: {
      entities: normalized.entities,
      items: normalized.result,
      rankingMode,
      options,
      offset,
      nextUrl,
      timestamp: Date.now(),
    }
  };
}

function requestRanking(rankingMode, options, offset) {
  return {
    type: REQUEST_RANKING,
    payload: {
      rankingMode,
      options,
      offset,
    }
  };
}

function stopRanking(rankingMode, options, offset) {
  return {
    type: STOP_RANKING,
    payload: {
      options,
      rankingMode,
      offset,
    }
  };
}

function shouldFetchRanking(state, rankingMode) {
  if (!rankingMode) {
    return false;
  }
  const results = state.ranking[rankingMode];
  if (results && results.loading) {
    return false;
  } else {
    return true;
  }
}

function fetchRankingFromApi(rankingMode, options = {}, nextUrl) {
  if (!nextUrl) {
    switch (rankingMode) {
      case RankingMode.DAILY:
        options.mode = 'day';
        break;
      case RankingMode.DAILY_MALE:
        options.mode = 'day_male';
        break;
      case RankingMode.DAILY_FEMALE:
        options.mode = 'day_female';
      case RankingMode.WEEKLY_ORIGINAL:
        options.mode = 'week_original';
        break;
      case RankingMode.WEEKLY_ROOKIE:
        options.mode = 'week_rookie';
        break;
      case RankingMode.WEEKLY:
        options.mode = 'week';
        break;
      case RankingMode.MONTHLY:
        options.mode = 'month';
        break;
    }
  }
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.illustRanking(options);
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(requestRanking(rankingMode, options, offset));
    return promise
      .then(json => {
        const normalized = normalize(json.illusts, Schemas.ILLUST_ARRAY);
        dispatch(receiveRanking(normalized, json.next_url, rankingMode, options, offset));
      })
      .catch(err => {
        dispatch(stopRanking(rankingMode, options, offset));
        dispatch(addError(err));
      });
  };
}

export function fetchRanking(rankingMode, options, nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchRanking(getState(), rankingMode)) {
      return dispatch(fetchRankingFromApi(rankingMode, options, nextUrl));
    }
  };
}

export function clearRanking(rankingMode){
  return {
    type: CLEAR_RANKING,
    payload: {
      rankingMode
    }
  };
}

export function clearAllRanking(rankingMode){
  return {
    type: CLEAR_ALL_RANKING,
    payload: {
      rankingMode
    }
  };
}
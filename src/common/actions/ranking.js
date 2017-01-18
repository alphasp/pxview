//import { createAction } from 'redux-actions';
import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_RANKING = 'REQUEST_RANKING';
export const RECEIVE_RANKING = 'RECEIVE_RANKING';
export const STOP_RANKING = 'STOP_RANKING';
export const CLEAR_RANKING = 'CLEAR_RANKING';
export const CLEAR_ALL_RANKING = 'CLEAR_ALL_RANKING';

export const RankingMode = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
};

function receiveRanking(json, rankingMode, options, offset) { 
  return {
    type: RECEIVE_RANKING,
    payload: {
      items: json.illusts,
      rankingMode,
      options,
      offset,
      nextUrl: json.next_url,
      receivedAt: Date.now(),
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
        dispatch(receiveRanking(json, rankingMode, options, offset))
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
import qs from 'qs';
import { RANKING } from '../constants/actionTypes';

export function fetchRankingSuccess(entities, items, rankingMode, nextUrl) {
  return {
    type: RANKING.SUCCESS,
    payload: {
      rankingMode,
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    }
  };
}

export function fetchRankingFailure(rankingMode) {
  return {
    type: RANKING.FAILURE,
    payload: {
      rankingMode
    }
  };
}

export function fetchRanking(rankingMode, options, nextUrl, refreshing = false) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || "0";
  return {
    type: RANKING.REQUEST,
    payload: {
      rankingMode,
      options,
      offset,
      nextUrl,
      refreshing
    }
  };
}

export function clearRanking(rankingMode) {
  return {
    type: RANKING.CLEAR,
    payload: {
      rankingMode
    }
  };
}

export function clearAllRanking(rankingMode){
  return {
    type: RANKING.CLEAR_ALL,
    payload: {
      rankingMode
    }
  };
}
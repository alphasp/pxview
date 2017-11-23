import qs from 'qs';
import { NOVEL_SERIES } from '../constants/actionTypes';

export function fetchNovelSeriesSuccess(entities, items, seriesId, nextUrl) {
  return {
    type: NOVEL_SERIES.SUCCESS,
    payload: {
      seriesId,
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchNovelSeriesFailure(seriesId) {
  return {
    type: NOVEL_SERIES.FAILURE,
    payload: {
      seriesId,
    },
  };
}

export function fetchNovelSeries(
  seriesId,
  options,
  nextUrl,
  refreshing = false,
) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || '0';
  return {
    type: NOVEL_SERIES.REQUEST,
    payload: {
      seriesId,
      options,
      offset,
      nextUrl,
      refreshing,
    },
  };
}

export function clearNovelSeries(seriesId) {
  return {
    type: NOVEL_SERIES.CLEAR,
    payload: {
      seriesId,
    },
  };
}

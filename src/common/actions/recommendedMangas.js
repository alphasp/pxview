import qs from "qs";
import { RECOMMENDED_MANGAS } from '../constants/actionTypes';

export function fetchRecommendedMangasSuccess(entities, items, nextUrl) {
  return {
    type: RECOMMENDED_MANGAS.SUCCESS,
    payload: {
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    }
  };
}

export function fetchRecommendedMangasFailure() {
  return {
    type: RECOMMENDED_MANGAS.FAILURE,
  };
}

export function fetchRecommendedMangas(options, nextUrl, refreshing = false) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || "0";
  return {
    type: RECOMMENDED_MANGAS.REQUEST,
    payload: {
      options,
      offset,
      nextUrl,
      refreshing
    }
  };
}

export function clearRecommendedMangas() {
  return {
    type: RECOMMENDED_MANGAS.CLEAR
  };
}
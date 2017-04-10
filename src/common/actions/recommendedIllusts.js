import qs from "qs";
import { normalize } from 'normalizr';
import { addError } from './error';
import pixiv from '../helpers/ApiClient';
import Schemas from '../constants/schemas';
import { RECOMMENDED_ILLUSTS } from '../constants/actionTypes';

export function fetchRecommendedIllustsSuccess(entities, items, nextUrl) {
  return {
    type: RECOMMENDED_ILLUSTS.SUCCESS,
    payload: {
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    }
  };
}

export function fetchRecommendedIllustsFailure() {
  return {
    type: RECOMMENDED_ILLUSTS.FAILURE,
  };
}

export function fetchRecommendedIllusts(options, nextUrl, refreshing = false) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || "0";
  return {
    type: RECOMMENDED_ILLUSTS.REQUEST,
    payload: {
      offset,
      nextUrl,
      refreshing
    }
  };
}

export function clearRecommendedIllusts() {
  return {
    type: RECOMMENDED_ILLUSTS.CLEAR
  };
}
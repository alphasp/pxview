import qs from 'qs';
import { MY_PIXIV_NOVELS } from '../constants/actionTypes';

export function fetchMyPixivNovelsSuccess(entities, items, nextUrl) {
  return {
    type: MY_PIXIV_NOVELS.SUCCESS,
    payload: {
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchMyPixivNovelsFailure() {
  return {
    type: MY_PIXIV_NOVELS.FAILURE,
  };
}

export function fetchMyPixivNovels(nextUrl, refreshing = false) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || '0';
  return {
    type: MY_PIXIV_NOVELS.REQUEST,
    payload: {
      offset,
      nextUrl,
      refreshing,
    },
  };
}

export function clearMyPixivNovels() {
  return {
    type: MY_PIXIV_NOVELS.CLEAR,
  };
}

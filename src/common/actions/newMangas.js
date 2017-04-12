import { NEW_MANGAS } from '../constants/actionTypes';

export function fetchNewMangasSuccess(entities, items, nextUrl) {
  return {
    type: NEW_MANGAS.SUCCESS,
    payload: {
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    }
  };
}

export function fetchNewMangasFailure() {
  return {
    type: NEW_MANGAS.FAILURE
  };
}

export function fetchNewMangas(nextUrl, refreshing = false) {
  return {
    type: NEW_MANGAS.REQUEST,
    payload: {
      nextUrl,
      refreshing
    }
  };
}

export function clearNewMangas() {
  return {
    type: NEW_MANGAS.CLEAR
  };
}
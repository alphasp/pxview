import qs from 'qs';
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const SET_SEARCH_TYPE = 'SET_SEARCH_TYPE';
export const SearchType = {
  ILLUST: 'ILLUST',
  USER: 'USER',
};

export function setSearchType(type) {
  return {
    type: SET_SEARCH_TYPE,
    payload: {
      type,
    },
  };
}

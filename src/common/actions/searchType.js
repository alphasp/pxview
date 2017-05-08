import { SEARCH_TYPE } from '../constants/actionTypes';

// eslint-disable-next-line import/prefer-default-export
export function setSearchType(type) {
  return {
    type: SEARCH_TYPE.SET,
    payload: {
      type,
    },
  };
}

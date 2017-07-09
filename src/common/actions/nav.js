/* eslint-disable import/prefer-default-export */

import { NAV } from '../constants/actionTypes';

export function navReplace(routeName, key, params) {
  return {
    type: NAV.REPLACE,
    routeName,
    key,
    params,
  };
}

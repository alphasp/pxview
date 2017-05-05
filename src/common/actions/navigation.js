/* eslint-disable import/prefer-default-export */

import { NAVIGATION } from '../constants/actionTypes';

export function navigationReplace(routeName, key, params) {
  return {
    type: NAVIGATION.REPLACE,
    routeName,
    key,
    params,
  };
}

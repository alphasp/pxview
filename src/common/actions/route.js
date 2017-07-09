/* eslint-disable import/prefer-default-export */

import { ROUTE } from '../constants/actionTypes';

export function setCurrentRoute(route) {
  return {
    type: ROUTE.SET,
    payload: {
      route,
    },
  };
}

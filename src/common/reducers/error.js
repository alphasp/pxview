/* eslint no-shadow: ["error", { "allow": ["error"] }] */
/* eslint-env es6 */

import { ERROR } from '../constants/actionTypes';

export default function error(state = null, action) {
  const { type, payload, error } = action;
  if (type === ERROR.CLEAR) {
    return null;
  } else if (type.includes('redux-form')) {
    return state;
  } else if (error) {
    return payload;
  }
  return state;
}

/* eslint no-shadow: ["error", { "allow": ["error"] }] */
/* eslint-env es6 */

import { RESET_ERROR_MESSAGE } from '../actions/error';

export default function error(state = null, action) {
  const { type, payload, error } = action;
  if (type === RESET_ERROR_MESSAGE) {
    return null;
  } else if (type.includes('redux-form')) {
    return state;
  } else if (error) {
    return payload;
  }
  return state;
}

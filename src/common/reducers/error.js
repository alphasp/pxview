import { RESET_ERROR_MESSAGE } from '../actions/error';

// Updates error message to notify about the failed fetches.
export default function error(state = null, action) {
  const { type, payload, error } = action;
  if (type === RESET_ERROR_MESSAGE) {
    return null;
  }
  else if (type.includes('redux-form')) {
    return state;
  }
  else if (error) {
    return action.payload;
  }
  return state;
}

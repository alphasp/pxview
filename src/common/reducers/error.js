import { RESET_ERROR_MESSAGE } from '../actions/error';

// Updates error message to notify about the failed fetches.
export default function errorMessage(state = null, action) {
  const { type, payload, error } = action

  if (type === RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return action.payload;
  }

  return state
}
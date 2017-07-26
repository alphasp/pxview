import { VERIFICATION_EMAIL } from '../constants/actionTypes';

export function sendVerificationEmail() {
  return {
    type: VERIFICATION_EMAIL.REQUEST,
  };
}

export function sendVerificationEmailSuccess() {
  return {
    type: VERIFICATION_EMAIL.SUCCESS,
    payload: {
      timestamp: Date.now(),
    },
  };
}

export function sendVerificationEmailFailure() {
  return {
    type: VERIFICATION_EMAIL.FAILURE,
  };
}

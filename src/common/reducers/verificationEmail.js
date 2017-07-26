import { VERIFICATION_EMAIL } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  success: false,
};

export default function verificationEmail(state = initState, action) {
  switch (action.type) {
    case VERIFICATION_EMAIL.REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
      };
    case VERIFICATION_EMAIL.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        success: true,
        timestamp: action.payload.timestamp,
      };
    case VERIFICATION_EMAIL.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        success: false,
      };
    default:
      return state;
  }
}

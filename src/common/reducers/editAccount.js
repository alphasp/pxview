import { EDIT_ACCOUNT } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  success: false,
  validationErrors: null,
};

export default function editAccount(state = initState, action) {
  switch (action.type) {
    case EDIT_ACCOUNT.CLEAR:
      return initState;
    case EDIT_ACCOUNT.REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        validationErrors: null,
      };
    case EDIT_ACCOUNT.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        success: true,
        timestamp: action.payload.timestamp,
      };
    case EDIT_ACCOUNT.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        success: false,
        validationErrors: action.payload.validationErrors,
      };
    default:
      return state;
  }
}

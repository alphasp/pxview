import { EDIT_ACCOUNT } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  success: false,
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
      };
    default:
      return state;
  }
}

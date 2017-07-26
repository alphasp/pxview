import { MY_ACCOUNT_STATE } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  refreshing: false,
  item: null,
};

export default function myAccountState(state = initState, action) {
  switch (action.type) {
    case MY_ACCOUNT_STATE.CLEAR:
      return initState;
    case MY_ACCOUNT_STATE.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case MY_ACCOUNT_STATE.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        item: action.payload.item,
        timestamp: action.payload.timestamp,
      };
    case MY_ACCOUNT_STATE.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
      };
    default:
      return state;
  }
}

import { WALKTHROUGH_ILLUSTS } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
};

export default function walkthroughIllusts(state = initState, action) {
  switch (action.type) {
    case WALKTHROUGH_ILLUSTS.CLEAR:
      return initState;
    case WALKTHROUGH_ILLUSTS.REQUEST:
      return {
        ...state,
        loading: true,
        refreshing: action.payload.refreshing,
      };
    case WALKTHROUGH_ILLUSTS.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        refreshing: false,
        items: [...state.items, ...action.payload.items],
        timestamp: action.payload.timestamp,
      };
    case WALKTHROUGH_ILLUSTS.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        refreshing: false,
      };
    default:
      return state;
  }
}

import { SET_SEARCH_TYPE, SearchType } from "../actions/searchType";

export default function searchType(state = {
  type: SearchType.ILLUST
}, action = {}) {
  switch (action.type) {
    case SET_SEARCH_TYPE:
      return {
        ...state,
        type: action.payload.type,
      };
    default:
      return state;
  }
}
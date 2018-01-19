import { SEARCH_AUTOCOMPLETE } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  items: [],
  word: null,
};

export default function searchAutoComplete(state = initState, action) {
  switch (action.type) {
    case SEARCH_AUTOCOMPLETE.CLEAR:
      return initState;
    case SEARCH_AUTOCOMPLETE.REQUEST:
      return {
        ...state,
        loading: true,
        word: action.payload.word,
      };
    case SEARCH_AUTOCOMPLETE.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...action.payload.items],
        timestamp: action.payload.timestamp,
      };
    case SEARCH_AUTOCOMPLETE.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
      };
    default:
      return state;
  }
}

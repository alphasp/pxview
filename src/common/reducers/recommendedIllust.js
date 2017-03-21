import { 
  REQUEST_RECOMMENDED_ILLUSTS, 
  RECEIVE_RECOMMENDED_ILLUSTS,
  STOP_RECOMMENDED_ILLUSTS, 
  CLEAR_RECOMMENDED_ILLUSTS,
} from "../actions/recommendedIllust";

export function recommendedIllust(state = {
  loading: false,
  loaded: false,
  items: [],
  offset: 0,
  url: null,
  isPublicRecommended: true,
  nextUrl: null,
}, action) {
  switch (action.type) {
    case CLEAR_RECOMMENDED_ILLUSTS:
      return {
        ...state,
        loading: false,
        loaded: false,
        items: [],
        offset: 0,
        url: null,
        nextUrl: null,
      };
    case REQUEST_RECOMMENDED_ILLUSTS:
      return {
        ...state,
        loading: true,
        url: null,
        isPublicRecommended: action.payload.isPublicRecommended,
      };
    case RECEIVE_RECOMMENDED_ILLUSTS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...state.items, ...action.payload.items],
        offset: action.payload.offset,
        nextUrl: action.payload.nextUrl,
        url: null,
        isPublicRecommended: action.payload.isPublicRecommended,
        lastUpdated: action.payload.receivedAt,
      };
    case STOP_RECOMMENDED_ILLUSTS:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
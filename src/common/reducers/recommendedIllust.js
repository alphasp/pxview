import { 
  REQUEST_RECOMENDED_ILLUSTS, 
  RECEIVE_RECOMENDED_ILLUSTS,
  STOP_RECOMENDED_ILLUSTS, 
  CLEAR_RECOMENDED_ILLUSTS,

  REQUEST_RELATED_ILLUSTS, 
  RECEIVE_RELATED_ILLUSTS, 
  STOP_RELATED_ILLUSTS, 
  CLEAR_RELATED_ILLUSTS
} from "../actions/recommendedIllust";

export function recommendedIllust(state = {
  loading: false,
  loaded: false,
  items: [],
  related: {},
  offset: 0,
  nextUrl: null,
}, action) {
  switch (action.type) {
    case CLEAR_RECOMENDED_ILLUSTS:
      return {
        ...state,
        loading: false,
        loaded: false,
        items: [],
        offset: 0,
        nextUrl: null,
      };
    case REQUEST_RECOMENDED_ILLUSTS:
      return {
        ...state,
        loading: true,
      };

    case RECEIVE_RECOMENDED_ILLUSTS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...state.items, ...action.payload.items],
        offset: action.payload.offset,
        nextUrl: action.payload.nextUrl,
        lastUpdated: action.payload.receivedAt,
      };
    case STOP_RECOMENDED_ILLUSTS:
      return {
        ...state,
        loading: false,
      };

    // case CLEAR_RELATED_ILLUSTS:
    //   return {
    //     ...state,
    //     related: {}
    //   };
    // case REQUEST_RELATED_ILLUSTS:
    //   return {
    //     ...state,
    //     related: {
    //       loading: true,
    //       illustId: action.payload.illustId,
    //     }
    //   };
    // case RECEIVE_RELATED_ILLUSTS:
    //   return {
    //     ...state,
    //     related: {
    //       ...state.related,
    //       items: [...state.relatedItems, ...action.payload.items],
    //       loading: false,
    //       loaded: true,
    //       illustId: action.payload.illustId,
    //       offset: action.payload.offset,
    //       nextUrl: action.payload.nextUrl,
    //       lastUpdated: action.payload.receivedAt,
    //     }
    //   }
    // case STOP_RELATED_ILLUSTS:
    //   return {
    //     ...state,
    //     related: {
    //       ...state.related,
    //       loading: false
    //     }
    //   };
    default:
      return state;
  }
}
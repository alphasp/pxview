import { NOVEL_SERIES } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
  offset: null,
  nextUrl: null,
};

export default function novelSeries(state = {}, action) {
  switch (action.type) {
    case NOVEL_SERIES.CLEAR:
      return {
        ...state,
        [action.payload.seriesId]: initState,
      };
    case NOVEL_SERIES.REQUEST:
      return {
        ...state,
        [action.payload.seriesId]: {
          ...state[action.payload.seriesId],
          loading: true,
        },
      };
    case NOVEL_SERIES.SUCCESS:
      return {
        ...state,
        [action.payload.seriesId]: {
          ...state[action.payload.seriesId],
          loading: false,
          loaded: true,
          items:
            state[action.payload.seriesId] &&
            state[action.payload.seriesId].items
              ? [
                  ...new Set([
                    ...state[action.payload.seriesId].items,
                    ...action.payload.items,
                  ]),
                ]
              : action.payload.items,
          offset: action.payload.offset,
          nextUrl: action.payload.nextUrl,
          timestamp: action.payload.timestamp,
        },
      };
    case NOVEL_SERIES.FAILURE:
      return {
        ...state,
        [action.payload.seriesId]: {
          ...state[action.payload.seriesId],
          loading: false,
          loaded: true,
        },
      };
    default:
      return state;
  }
}

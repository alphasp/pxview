import merge from 'lodash/merge';
import { 
  BOOKMARK_ILLUST, 
  UNBOOKMARK_ILLUST,
} from "../actions/bookmarkIllust";

export default function entities(state = {
  illusts: {},
  users: {}, 
}, action) {
  if (action && action.payload && action.payload.entities) {
    return merge({}, state, action.payload.entities);
  }
  switch (action.type) {
    case BOOKMARK_ILLUST:
      return {
        ...state,
        illusts: Object.keys(state.illusts).reduce((prev, id) => {
          return {
            ...prev,
            [id]: state.illusts[id].id === action.payload.illustId ?
              { ...state.illusts[id], is_bookmarked: true }
              :
              state.illusts[id]
          };
        }, {})
      }
    case UNBOOKMARK_ILLUST:
      return {
        ...state,
        illusts: Object.keys(state.illusts).reduce((prev, id) => {
          return {
            ...prev,
            [id]: state.illusts[id].id === action.payload.illustId ?
              { ...state.illusts[id], is_bookmarked: false }
              :
              state.illusts[id]
          };
        }, {})
      }
    default:
      return state;
  }
  return state;
}

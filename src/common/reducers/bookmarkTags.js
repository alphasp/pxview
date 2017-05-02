import { BOOKMARK_TAGS } from '../constants/actionTypes';
import { TAG_TYPES } from '../constants/tagTypes';

const defaultItems = [{ name: 'All', value: '' }, { name: 'Uncategorized', value: '未分類' }];
const defaultState = {
  loading: false,
  loaded: false,
  items: defaultItems,
  offset: null,
  nextUrl: null,
};

export default function bookmarkTags(state = {
  [TAG_TYPES.PUBLIC]: defaultState,
  [TAG_TYPES.PRIVATE]: defaultState,
}, action) {
  switch (action.type) {
    case BOOKMARK_TAGS.CLEAR:
      return {
        ...state,
        [action.payload.tagType]: defaultState,
      };
    case BOOKMARK_TAGS.REQUEST:
      return {
        ...state,
        [action.payload.tagType]: {
          ...state[action.payload.tagType],
          offset: action.payload.offset,
          loading: true,
        },
      };
    case BOOKMARK_TAGS.SUCCESS:
      return {
        ...state,
        [action.payload.tagType]: {
          ...state[action.payload.tagType],
          loading: false,
          loaded: true,
          items: (state[action.payload.tagType] && state[action.payload.tagType].items) ? [...state[action.payload.tagType].items, ...action.payload.items] : action.payload.items,
          offset: action.payload.offset,
          nextUrl: action.payload.nextUrl,
          timestamp: action.payload.timestamp,
        },
      };
    case BOOKMARK_TAGS.FAILURE:
      return {
        ...state,
        [action.payload.tagType]: {
          ...state[action.payload.tagType],
          offset: action.payload.offset,
          loading: false,
          loaded: true,
        },
      };
    default:
      return state;
  }
}

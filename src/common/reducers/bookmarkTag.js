import { REQUEST_BOOKMARK_TAG, RECEIVE_BOOKMARK_TAG, STOP_BOOKMARK_TAG, CLEAR_BOOKMARK_TAG, CLEAR_ALL_BOOKMARK_TAG, TagType } from "../actions/bookmarkTag";

const defaultItems = [{ name: 'All', value: '' }, { name: 'Uncategorized', value: '未分類' }];
export default function search(state = {
  [TagType.PUBLIC]: {
    items: defaultItems
  },
  [TagType.PRIVATE]: {
    items: defaultItems
  },
}, action) {
  switch (action.type) {
    case CLEAR_BOOKMARK_TAG:
      return {
        ...state,
        [action.payload.tagType]: {
          items: defaultItems
        },
      };
    case CLEAR_ALL_BOOKMARK_TAG:
      return {
        [TagType.PUBLIC]: {
          items: defaultItems
        },
        [TagType.PRIVATE]: {
          items: defaultItems
        },
      };  
    case REQUEST_BOOKMARK_TAG:
      return {
        ...state,
        [action.payload.tagType]: {
          ...state[action.payload.tagType],
          options: action.payload.options,
          offset: action.payload.offset,
          loading: true,
        }
      };
    case RECEIVE_BOOKMARK_TAG:
      return {
        ...state,
        [action.payload.tagType]: {
          ...state[action.payload.tagType],
          options: action.payload.options,
          loading: false,
          loaded: true,
          items: (state[action.payload.tagType] && state[action.payload.tagType].items) ? [...state[action.payload.tagType].items, ...action.payload.items] : action.payload.items,
          offset: action.payload.offset,
          nextUrl: action.payload.nextUrl,
          lastUpdated: action.payload.receivedAt
        }
      };
    case STOP_BOOKMARK_TAG:
      return {
        ...state,
        [action.payload.tagType]: {
          ...state[action.payload.tagType],
          options: action.payload.options,
          offset: action.payload.offset,
          loading: false
        }
      };
    default:
      return state;
  }
}
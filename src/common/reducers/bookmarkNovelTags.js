import { BOOKMARK_NOVEL_TAGS } from '../constants/actionTypes';
import { TAG_TYPES } from '../constants';

const defaultItems = [
  { name: 'All', value: '' },
  { name: 'Uncategorized', value: '未分類' },
];
const initState = {
  loading: false,
  loaded: false,
  items: defaultItems,
  offset: null,
  nextUrl: null,
};

export default function bookmarkIllustTags(
  state = {
    [TAG_TYPES.PUBLIC]: initState,
    [TAG_TYPES.PRIVATE]: initState,
  },
  action,
) {
  switch (action.type) {
    case BOOKMARK_NOVEL_TAGS.CLEAR:
      return {
        ...state,
        [action.payload.tagType]: initState,
      };
    case BOOKMARK_NOVEL_TAGS.REQUEST:
      return {
        ...state,
        [action.payload.tagType]: {
          ...state[action.payload.tagType],
          offset: action.payload.offset,
          loading: true,
        },
      };
    case BOOKMARK_NOVEL_TAGS.SUCCESS:
      return {
        ...state,
        [action.payload.tagType]: {
          ...state[action.payload.tagType],
          loading: false,
          loaded: true,
          items:
            state[action.payload.tagType] && state[action.payload.tagType].items
              ? [
                  ...new Set([
                    ...state[action.payload.tagType].items,
                    ...action.payload.items,
                  ]),
                ]
              : action.payload.items,
          offset: action.payload.offset,
          nextUrl: action.payload.nextUrl,
          timestamp: action.payload.timestamp,
        },
      };
    case BOOKMARK_NOVEL_TAGS.FAILURE:
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

import { 
  REQUEST_SEARCH, 
  RECEIVE_SEARCH, 
  STOP_SEARCH, 
  CLEAR_SEARCH, 
  CLEAR_ALL_SEARCH,
  SortType
} from "../actions/search";
import { 
  BOOKMARK_ILLUST, 
  UNBOOKMARK_ILLUST,
} from "../actions/bookmarkIllust";
//gg["newest"]["miku"]
//navigationState.key
export default function search(state = {
  [SortType.ASC]: {},
  [SortType.DESC]: {},
}, action) {
  switch (action.type) {
    case CLEAR_SEARCH:
      return {
        ...state,
        [action.payload.sortType]: {
          ...state[action.payload.sortType],
          [action.payload.navigationStateKey]: {},
        }
      };
    case CLEAR_ALL_SEARCH:
      return {
        [SortType.ASC]: {},
        [SortType.DESC]: {},
      };
    case REQUEST_SEARCH:
      return {
        ...state,
        [action.payload.sortType]: {
          ...state[action.payload.sortType],
          [action.payload.navigationStateKey]: {
            ...state[action.payload.sortType][action.payload.navigationStateKey],
            word: action.payload.word,
            options: action.payload.options,
            offset: action.payload.offset,
            loading: true
          },
        }
      };

    case RECEIVE_SEARCH:
      return {
        ...state,
        [action.payload.sortType]: {
          ...state[action.payload.sortType],
          [action.payload.navigationStateKey]: {
            ...state[action.payload.sortType][action.payload.navigationStateKey],
            word: action.payload.word,
            options: action.payload.options,
            loading: false,
            loaded: true,
            items: (state[action.payload.sortType][action.payload.navigationStateKey] && state[action.payload.sortType][action.payload.navigationStateKey].items) ? [...state[action.payload.sortType][action.payload.navigationStateKey].items, ...action.payload.items] : action.payload.items,
            offset: action.payload.offset,
            nextUrl: action.payload.nextUrl,
            lastUpdated: action.payload.receivedAt
          }
        }
      };
    case STOP_SEARCH:
      return {
        ...state,
        [action.payload.sortType]: {
          ...state[action.payload.sortType],
          [action.payload.navigationStateKey]: {
            ...state[action.payload.sortType][action.payload.navigationStateKey],
            word: action.payload.word,
            options: action.payload.options,
            offset: action.payload.offset,
            loading: false
          }
        }
      };
    case BOOKMARK_ILLUST:
      return {
        ...state,
        [SortType.ASC]: Object.keys(state[SortType.ASC]).reduce((prev, key) => {
          prev[key] = {
            ...state[SortType.ASC][key],
            items: state[SortType.ASC][key].items.map(item => 
              item.id === action.payload.illustId ?
              { ...item, is_bookmarked: true } 
              :
              item
            )
          }
          return prev;
        }, {}),
        [SortType.DESC]: Object.keys(state[SortType.DESC]).reduce((prev, key) => {
          prev[key] = {
            ...state[SortType.DESC][key],
            items: state[SortType.DESC][key].items.map(item => 
              item.id === action.payload.illustId ?
              { ...item, is_bookmarked: true } 
              :
              item
            )
          }
          return prev;
        }, {}),
      }
    case UNBOOKMARK_ILLUST:
      return {
        ...state,
        [SortType.ASC]: Object.keys(state[SortType.ASC]).reduce((prev, key) => {
          prev[key] = {
            ...state[SortType.ASC][key],
            items: state[SortType.ASC][key].items.map(item => 
              item.id === action.payload.illustId ?
              { ...item, is_bookmarked: false } 
              :
              item
            )
          }
          return prev;
        }, {}),
        [SortType.DESC]: Object.keys(state[SortType.DESC]).reduce((prev, key) => {
          prev[key] = {
            ...state[SortType.DESC][key],
            items: state[SortType.DESC][key].items.map(item => 
              item.id === action.payload.illustId ?
              { ...item, is_bookmarked: false } 
              :
              item
            )
          }
          return prev;
        }, {}),
      }
    default:
      return state;
  }
}
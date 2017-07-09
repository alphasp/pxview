import { BROWSING_HISTORY } from '../constants/actionTypes';

export default function browsingHistory(
  state = {
    loading: false,
    loaded: true,
    refreshing: false,
    items: [],
  },
  action = {},
) {
  switch (action.type) {
    case BROWSING_HISTORY.ADD: {
      let newItems;
      const items = state.items;
      const newItem = action.payload.item;
      if (items && items.length) {
        if (items.indexOf(newItem) === -1) {
          newItems = [newItem, ...items.slice(0, 99)];
        } else {
          newItems = [...items];
        }
      } else {
        newItems = [newItem];
      }
      return {
        ...state,
        items: newItems,
      };
    }
    case BROWSING_HISTORY.REMOVE:
      return {
        ...state,
        items: state.items.filter(item => item !== action.payload.item),
      };
    case BROWSING_HISTORY.CLEAR:
      return {
        ...state,
        items: [],
      };
    default:
      return state;
  }
}

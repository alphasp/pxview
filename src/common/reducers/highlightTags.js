import { HIGHLIGHT_TAGS } from '../constants/actionTypes';

export default function highlightTags(
  state = {
    items: [],
  },
  action = {},
) {
  switch (action.type) {
    case HIGHLIGHT_TAGS.ADD: {
      let newItems;
      const { items } = state;
      const newItem = action.payload.item;
      if (items && items.length) {
        if (items.indexOf(newItem) === -1) {
          newItems = [newItem, ...items.slice(0, 200)];
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
    case HIGHLIGHT_TAGS.REMOVE:
      return {
        ...state,
        items: state.items.filter(item => item !== action.payload.item),
      };
    case HIGHLIGHT_TAGS.CLEAR:
      return {
        ...state,
        items: [],
      };
    default:
      return state;
  }
}

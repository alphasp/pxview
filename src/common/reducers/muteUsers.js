import { MUTE_USERS } from '../constants/actionTypes';

export default function muteTags(
  state = {
    items: [],
  },
  action = {},
) {
  switch (action.type) {
    case MUTE_USERS.ADD: {
      let newItems;
      const { items } = state;
      const newItem = action.payload.item;
      if (items && items.length) {
        if (items.some((item) => item.id !== newItem.id)) {
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
    case MUTE_USERS.REMOVE:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    case MUTE_USERS.CLEAR:
      return {
        ...state,
        items: [],
      };
    case MUTE_USERS.RESTORE:
      return {
        ...state,
        ...action.payload.state,
      };
    default:
      return state;
  }
}

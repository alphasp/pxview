import { SEARCH_HISTORY } from '../constants/actionTypes';

export default function searchHistory(state = {
  items: []
}, action = {}) {
  switch (action.type) {
    case SEARCH_HISTORY.ADD:
      let newItems;
      const items = state.items;
      const newItem = action.payload.item;
      if (items && items.length) {
        if (items.indexOf(newItem) === -1) {
          newItems = [newItem, ...items.slice(0, 9)] 
        }
        else {
          newItems = [...items]
        }
      }
      else {
        newItems = [newItem];
      }
      return {
        ...state,
        items: newItems
      };
    case SEARCH_HISTORY.REMOVE:
      return {
        ...state,
        items: state.items.filter(item => item !== action.payload.item)
      }
    case SEARCH_HISTORY.CLEAR: {
      return {
        ...state,
        items: [],
      }
    }
    default:
      return state;
  }
}
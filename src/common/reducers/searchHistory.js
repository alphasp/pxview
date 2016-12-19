import { ADD_SEARCH_HISTORY, REMOVE_SEARCH_HISTORY, CLEAR_SEARCH_HISTORY } from "../actions/searchHistory";

export default function searchHistory(state = {
  items: []
}, action = {}) {
  switch (action.type) {
    case ADD_SEARCH_HISTORY:
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
    case REMOVE_SEARCH_HISTORY:
      return {
        ...state,
        items: state.items.filter(item => item !== action.payload.item)
      }
    case CLEAR_SEARCH_HISTORY: {
      return {
        ...state,
        items: [],
      }
    }
    default:
      return state;
  }
}
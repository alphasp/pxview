import { HIGHLIGHT_TAGS } from '../constants/actionTypes';

export function addHighlightTag(item) {
  return {
    type: HIGHLIGHT_TAGS.ADD,
    payload: {
      item,
    },
  };
}

export function removeHighlightTag(item) {
  return {
    type: HIGHLIGHT_TAGS.REMOVE,
    payload: {
      item,
    },
  };
}

export function clearHighlightTags() {
  return {
    type: HIGHLIGHT_TAGS.CLEAR,
  };
}

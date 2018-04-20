import { NOVEL_COMMENT_REPLIES } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  items: [],
  offset: null,
  nextUrl: null,
};

export default function novelCommentReplies(state = {}, action) {
  switch (action.type) {
    case NOVEL_COMMENT_REPLIES.CLEAR:
      return {
        ...state,
        [action.payload.commentId]: initState,
      };
    case NOVEL_COMMENT_REPLIES.REQUEST:
      return {
        ...state,
        [action.payload.commentId]: {
          ...state[action.payload.commentId],
          loading: true,
        },
      };
    case NOVEL_COMMENT_REPLIES.SUCCESS:
      return {
        ...state,
        [action.payload.commentId]: {
          ...state[action.payload.commentId],
          loading: false,
          loaded: true,
          items:
            state[action.payload.commentId] &&
            state[action.payload.commentId].items
              ? [
                  ...new Set([
                    ...state[action.payload.commentId].items,
                    ...action.payload.items,
                  ]),
                ]
              : action.payload.items,
          offset: action.payload.offset,
          nextUrl: action.payload.nextUrl,
          timestamp: action.payload.timestamp,
        },
      };
    case NOVEL_COMMENT_REPLIES.FAILURE:
      return {
        ...state,
        [action.payload.commentId]: {
          ...state[action.payload.commentId],
          loading: false,
          loaded: true,
        },
      };
    default:
      return state;
  }
}

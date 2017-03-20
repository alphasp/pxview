import merge from 'lodash/merge';
import { 
  BOOKMARK_ILLUST, 
  UNBOOKMARK_ILLUST,
} from "../actions/bookmarkIllust";
import { 
  FOLLOW_USER, 
  UNFOLLOW_USER,
} from "../actions/followUser";

export default function entities(state = {
  illusts: {},
  users: {}, 
  userPreviews: {},
  userProfiles: {}
}, action) {
  if (action && action.payload && action.payload.entities) {
    return merge({}, state, action.payload.entities);
  }
  switch (action.type) {
    case BOOKMARK_ILLUST:
      // let illusts = { ...state.illusts };
      // illusts[action.payload.illustId] = Object.assign({}, {
      //   ...state.illusts[action.payload.illustId],
      //   is_bookmarked: true
      // });
      // console.log('illusts[action.payload.illustId] ', illusts[action.payload.illustId])
      // return {
      //   ...state,
      //   illusts
      // }
      return {
        ...state,
        illusts: Object.keys(state.illusts).reduce((prev, id) => {
          return {
            ...prev,
            [id]: state.illusts[id].id === action.payload.illustId ?
              { ...state.illusts[id], is_bookmarked: true }
              :
              state.illusts[id]
          };
        }, {})
      }
    case UNBOOKMARK_ILLUST:
      return {
        ...state,
        illusts: Object.keys(state.illusts).reduce((prev, id) => {
          return {
            ...prev,
            [id]: state.illusts[id].id === action.payload.illustId ?
              { ...state.illusts[id], is_bookmarked: false }
              :
              state.illusts[id]
          };
        }, {})
      }
    case FOLLOW_USER:
      return {
        ...state,
        users: Object.keys(state.users).reduce((prev, id) => {
          return {
            ...prev,
            [id]: state.users[id].id === action.payload.userId ?
              { ...state.users[id], is_followed: true }
              :
              state.users[id]
          };
        }, {})
      }
    case UNFOLLOW_USER:
      return {
        ...state,
        users: Object.keys(state.users).reduce((prev, id) => {
          return {
            ...prev,
            [id]: state.users[id].id === action.payload.userId ?
              { ...state.users[id], is_followed: false }
              :
              state.users[id]
          };
        }, {})
      }
    default:
      return state;
  }
}

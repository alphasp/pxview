// import merge from 'lodash.merge';
import {
  BOOKMARK_ILLUST,
  UNBOOKMARK_ILLUST,
  FOLLOW_USER,
  UNFOLLOW_USER,
  AUTH_LOGOUT,
} from '../constants/actionTypes';

export default function entities(
  state = {
    illusts: {},
    illustComments: {},
    users: {},
    userPreviews: {},
    userProfiles: {},
  },
  action,
) {
  if (action && action.payload && action.payload.entities) {
    // const t0 = performance.now();
    // const newState = merge({}, state, action.payload.entities);
    // const t1 = performance.now();
    // console.log(`took ${t1 - t0} milliseconds.`);
    // return merge({}, state, action.payload.entities);
    // https://github.com/reactjs/redux/issues/1262
    // const t0 = performance.now();
    const newState = { ...state };
    Object.keys(action.payload.entities).forEach(type => {
      const entity = action.payload.entities[type];
      newState[type] = {
        ...newState[type],
        ...entity,
      };
    });
    // const t1 = performance.now();
    // console.log(`took ${t1 - t0} milliseconds.`);
    return newState;
  }
  switch (action.type) {
    case BOOKMARK_ILLUST.REQUEST:
      if (!state.illusts[action.payload.illustId]) {
        return state;
      }
      return {
        ...state,
        illusts: {
          ...state.illusts,
          [action.payload.illustId]: {
            ...state.illusts[action.payload.illustId],
            is_bookmarked: true,
          },
        },
      };
    case UNBOOKMARK_ILLUST.REQUEST:
      if (!state.illusts[action.payload.illustId]) {
        return state;
      }
      return {
        ...state,
        illusts: {
          ...state.illusts,
          [action.payload.illustId]: {
            ...state.illusts[action.payload.illustId],
            is_bookmarked: false,
          },
        },
      };
    case FOLLOW_USER.REQUEST:
      if (!state.users[action.payload.userId]) {
        return state;
      }
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload.userId]: {
            ...state.users[action.payload.userId],
            is_followed: true,
          },
        },
        userProfiles: state.userProfiles[action.payload.userId]
          ? {
              ...state.userProfiles,
              [action.payload.userId]: {
                ...state.userProfiles[action.payload.userId],
                user: {
                  ...state.userProfiles[action.payload.userId].user,
                  is_followed: true,
                },
              },
            }
          : state.userProfiles,
      };
    case UNFOLLOW_USER.REQUEST:
      if (!state.users[action.payload.userId]) {
        return state;
      }
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload.userId]: {
            ...state.users[action.payload.userId],
            is_followed: false,
          },
        },
        userProfiles: state.userProfiles[action.payload.userId]
          ? {
              ...state.userProfiles,
              [action.payload.userId]: {
                ...state.userProfiles[action.payload.userId],
                user: {
                  ...state.userProfiles[action.payload.userId].user,
                  is_followed: false,
                },
              },
            }
          : state.userProfiles,
      };
    case AUTH_LOGOUT.SUCCESS:
      return {
        ...state,
        illusts: Object.keys(state.illusts).reduce((prev, key) => {
          prev[key] = {
            ...state.illusts[key],
            is_bookmarked: false,
          };
          return prev;
        }, {}),
        users: Object.keys(state.users).reduce((prev, key) => {
          prev[key] = {
            ...state.users[key],
            is_followed: false,
          };
          return prev;
        }, {}),
        userProfiles: Object.keys(state.userProfiles).reduce((prev, key) => {
          prev[key] = {
            ...state.userProfiles[key],
            user: {
              ...state.userProfiles[key].user,
              is_followed: false,
            },
          };
          return prev;
        }, {}),
      };
    default:
      return state;
  }
}

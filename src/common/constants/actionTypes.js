import { defineAction } from 'redux-define';
import {
  REQUEST,
  SUCCESS,
  FAILURE,
  CLEAR,
  CLEAR_ALL,
  ADD,
  ADD_SUCCESS,
  ADD_FAILURE,
  REMOVE,
  REPLACE,
  OPEN,
  CLOSE,
  STOP,
  SET,
} from './stateConstants';

const appNamespace = defineAction('PIXIV');

export const AUTH_LOGIN = defineAction(
  'AUTH_LOGIN',
  [REQUEST, SUCCESS, FAILURE, STOP],
  appNamespace,
);

export const AUTH_SIGNUP = defineAction(
  'AUTH_SIGNUP',
  [REQUEST, SUCCESS, FAILURE],
  appNamespace,
);

export const AUTH_LOGOUT = defineAction('AUTH_LOGOUT', [SUCCESS], appNamespace);

export const AUTH_REFRESH_ACCESS_TOKEN = defineAction(
  'AUTH_REFRESH_ACCESS_TOKEN',
  [REQUEST, SUCCESS, FAILURE],
  appNamespace,
);

export const AUTH_REHYDRATE = defineAction(
  'AUTH_REHYDRATE',
  [SUCCESS],
  appNamespace,
);

export const MY_ACCOUNT_STATE = defineAction(
  'MY_ACCOUNT_STATE',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const EDIT_ACCOUNT = defineAction(
  'EDIT_ACCOUNT',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const VERIFICATION_EMAIL = defineAction(
  'VERIFICATION_EMAIL',
  [REQUEST, SUCCESS, FAILURE],
  appNamespace,
);

export const ERROR = defineAction('ERROR', [ADD, CLEAR], appNamespace);

export const NAV = defineAction('NAV', [REPLACE], appNamespace);

export const WALKTHROUGH_ILLUSTS = defineAction(
  'WALKTHROUGH_ILLUSTS',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const RECOMMENDED_ILLUSTS = defineAction(
  'RECOMMENDED_ILLUSTS',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const RECOMMENDED_MANGAS = defineAction(
  'RECOMMENDED_MANGAS',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const RECOMMENDED_NOVELS = defineAction(
  'RECOMMENDED_NOVELS',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const ILLUST_DETAIL = defineAction(
  'ILLUST_DETAIL',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const NOVEL_DETAIL = defineAction(
  'NOVEL_DETAIL',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const RELATED_ILLUSTS = defineAction(
  'RELATED_ILLUSTS',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const ILLUST_COMMENTS = defineAction(
  'ILLUST_COMMENTS',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const ILLUST_COMMENT_REPLIES = defineAction(
  'ILLUST_COMMENT_REPLIES',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const ADD_ILLUST_COMMENT = defineAction(
  'ADD_ILLUST_COMMENT',
  [ADD, ADD_SUCCESS, ADD_FAILURE],
  appNamespace,
);

export const ADD_NOVEL_COMMENT = defineAction(
  'ADD_NOVEL_COMMENT',
  [ADD, ADD_SUCCESS, ADD_FAILURE],
  appNamespace,
);

export const NOVEL_COMMENTS = defineAction(
  'NOVEL_COMMENTS',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const NOVEL_COMMENT_REPLIES = defineAction(
  'NOVEL_COMMENT_REPLIES',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const NOVEL_SERIES = defineAction(
  'NOVEL_SERIES',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const NOVEL_TEXT = defineAction(
  'NOVEL_TEXT',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const RANKING = defineAction(
  'RANKING',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL],
  appNamespace,
);

export const USER_DETAIL = defineAction(
  'USER_DETAIL',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL],
  appNamespace,
);

export const USER_ILLUSTS = defineAction(
  'USER_ILLUSTS',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL],
  appNamespace,
);

export const USER_MANGAS = defineAction(
  'USER_MANGAS',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL],
  appNamespace,
);

export const USER_NOVELS = defineAction(
  'USER_NOVELS',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL],
  appNamespace,
);

export const USER_BOOKMARK_ILLUSTS = defineAction(
  'USER_BOOKMARK_ILLUSTS',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL],
  appNamespace,
);

export const USER_BOOKMARK_NOVELS = defineAction(
  'USER_BOOKMARK_NOVELS',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL],
  appNamespace,
);

export const USER_FOLLOWING = defineAction(
  'USER_FOLLOWING',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL],
  appNamespace,
);

export const USER_FOLLOWERS = defineAction(
  'USER_FOLLOWERS',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL],
  appNamespace,
);

export const USER_MY_PIXIV = defineAction(
  'USER_MY_PIXIV',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL],
  appNamespace,
);

export const MY_PRIVATE_BOOKMARK_ILLUSTS = defineAction(
  'MY_PRIVATE_BOOKMARK_ILLUSTS',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const MY_PRIVATE_BOOKMARK_NOVELS = defineAction(
  'MY_PRIVATE_BOOKMARK_NOVELS',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const FOLLOWING_USER_ILLUSTS = defineAction(
  'FOLLOWING_USER_ILLUSTS',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const FOLLOWING_USER_NOVELS = defineAction(
  'FOLLOWING_USER_NOVELS',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const NEW_ILLUSTS = defineAction(
  'NEW_ILLUSTS',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const NEW_MANGAS = defineAction(
  'NEW_MANGAS',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const NEW_NOVELS = defineAction(
  'NEW_NOVELS',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const MY_PIXIV_ILLUSTS = defineAction(
  'MY_PIXIV_ILLUSTS',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const MY_PIXIV_NOVELS = defineAction(
  'MY_PIXIV_NOVELS',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const TRENDING_ILLUST_TAGS = defineAction(
  'TRENDING_ILLUST_TAGS',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const TRENDING_NOVEL_TAGS = defineAction(
  'TRENDING_NOVEL_TAGS',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const RECOMMENDED_USERS = defineAction(
  'RECOMMENDED_USERS',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const SEARCH_ILLUSTS = defineAction(
  'SEARCH_ILLUSTS',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL],
  appNamespace,
);

export const SEARCH_NOVELS = defineAction(
  'SEARCH_NOVELS',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL],
  appNamespace,
);

export const SEARCH_USERS = defineAction(
  'SEARCH_USERS',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL],
  appNamespace,
);

export const SEARCH_AUTOCOMPLETE = defineAction(
  'SEARCH_AUTOCOMPLETE',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const SEARCH_USERS_AUTOCOMPLETE = defineAction(
  'SEARCH_USERS_AUTOCOMPLETE',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const SEARCH_ILLUSTS_BOOKMARK_RANGES = defineAction(
  'SEARCH_ILLUSTS_BOOKMARK_RANGES',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL],
  appNamespace,
);

export const SEARCH_NOVELS_BOOKMARK_RANGES = defineAction(
  'SEARCH_NOVELS_BOOKMARK_RANGES',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL],
  appNamespace,
);

export const BOOKMARK_ILLUST_TAGS = defineAction(
  'BOOKMARK_ILLUST_TAGS',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const BOOKMARK_NOVEL_TAGS = defineAction(
  'BOOKMARK_NOVEL_TAGS',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const ILLUST_BOOKMARK_DETAIL = defineAction(
  'ILLUST_BOOKMARK_DETAIL',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const NOVEL_BOOKMARK_DETAIL = defineAction(
  'NOVEL_BOOKMARK_DETAIL',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const BOOKMARK_ILLUST = defineAction(
  'BOOKMARK_ILLUST',
  [REQUEST, SUCCESS, FAILURE],
  appNamespace,
);

export const UNBOOKMARK_ILLUST = defineAction(
  'UNBOOKMARK_ILLUST',
  [REQUEST, SUCCESS, FAILURE],
  appNamespace,
);

export const BOOKMARK_NOVEL = defineAction(
  'BOOKMARK_NOVEL',
  [REQUEST, SUCCESS, FAILURE],
  appNamespace,
);

export const UNBOOKMARK_NOVEL = defineAction(
  'UNBOOKMARK_NOVEL',
  [REQUEST, SUCCESS, FAILURE],
  appNamespace,
);

export const USER_FOLLOW_DETAIL = defineAction(
  'USER_FOLLOW_DETAIL',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const FOLLOW_USER = defineAction(
  'FOLLOW_USER',
  [REQUEST, SUCCESS, FAILURE],
  appNamespace,
);

export const UNFOLLOW_USER = defineAction(
  'UNFOLLOW_USER',
  [REQUEST, SUCCESS, FAILURE],
  appNamespace,
);

export const UGOIRA_META = defineAction(
  'UGOIRA_META',
  [REQUEST, SUCCESS, FAILURE, CLEAR],
  appNamespace,
);

export const SEARCH_HISTORY = defineAction(
  'SEARCH_HISTORY',
  [ADD, REMOVE, CLEAR],
  appNamespace,
);

export const BROWSING_HISTORY_ILLUSTS = defineAction(
  'BROWSING_HISTORY_ILLUSTS',
  [ADD, REMOVE, CLEAR],
  appNamespace,
);

export const BROWSING_HISTORY_NOVELS = defineAction(
  'BROWSING_HISTORY_NOVELS',
  [ADD, REMOVE, CLEAR],
  appNamespace,
);
export const MUTE_TAGS = defineAction(
  'MUTE_TAGS',
  [ADD, REMOVE, CLEAR],
  appNamespace,
);

export const HIGHLIGHT_TAGS = defineAction(
  'HIGHLIGHT_TAGS',
  [ADD, REMOVE, CLEAR],
  appNamespace,
);

export const MUTE_USERS = defineAction(
  'MUTE_USERS',
  [ADD, REMOVE, CLEAR],
  appNamespace,
);

export const NOVEL_SETTINGS = defineAction(
  'NOVEL_SETTINGS',
  [SET],
  appNamespace,
);

export const SAVE_IMAGE_SETTINGS = defineAction(
  'SAVE_IMAGE_SETTINGS',
  [SET],
  appNamespace,
);

export const INITIAL_SCREEN_SETTINGS = defineAction(
  'INITIAL_SCREEN_SETTINGS',
  [SET],
  appNamespace,
);

export const LIKE_BUTTON_SETTINGS = defineAction(
  'LIKE_BUTTON_SETTINGS',
  [SET],
  appNamespace,
);

export const MUTE_SETTINGS = defineAction('MUTE_SETTINGS', [SET], appNamespace);

export const THEME = defineAction('THEME', [SET], appNamespace);

export const MODAL = defineAction('MODAL', [OPEN, CLOSE], appNamespace);

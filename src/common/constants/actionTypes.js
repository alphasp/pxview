import { defineAction } from 'redux-define';
import { REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL, ADD, REMOVE } from './stateConstants';

const appNamespace = defineAction('PIXIV');

export const RECOMMENDED_ILLUSTS = defineAction('RECOMMENDED_ILLUSTS',
  [REQUEST, SUCCESS, FAILURE, CLEAR], appNamespace);

export const RECOMMENDED_MANGAS = defineAction('RECOMMENDED_MANGAS',
  [REQUEST, SUCCESS, FAILURE, CLEAR], appNamespace);

export const RELATED_ILLUSTS = defineAction('RELATED_ILLUSTS',
  [REQUEST, SUCCESS, FAILURE, CLEAR], appNamespace);

export const ILLUST_COMMENTS = defineAction('ILLUST_COMMENTS',
  [REQUEST, SUCCESS, FAILURE, CLEAR], appNamespace);

export const RANKING = defineAction('RANKING',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL], appNamespace);

export const USER_DETAIL = defineAction('USER_DETAIL',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL], appNamespace);

export const USER_ILLUSTS = defineAction('USER_ILLUSTS',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL], appNamespace);

export const USER_MANGAS = defineAction('USER_MANGAS',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL], appNamespace);

export const USER_BOOKMARK_ILLUSTS = defineAction('USER_BOOKMARK_ILLUSTS',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL], appNamespace);

export const USER_FOLLOWING = defineAction('USER_FOLLOWING',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL], appNamespace);

export const USER_FOLLOWERS = defineAction('USER_FOLLOWERS',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL], appNamespace);

export const USER_MY_PIXIV = defineAction('USER_MY_PIXIV',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL], appNamespace);

export const MY_PRIVATE_BOOKMARK_ILLUSTS = defineAction('MY_PRIVATE_BOOKMARK_ILLUSTS',
  [REQUEST, SUCCESS, FAILURE, CLEAR], appNamespace);

export const FOLLOWING_USER_ILLUSTS = defineAction('FOLLOWING_USER_ILLUSTS',
  [REQUEST, SUCCESS, FAILURE, CLEAR], appNamespace);

export const NEW_ILLUSTS = defineAction('NEW_ILLUSTS',
  [REQUEST, SUCCESS, FAILURE, CLEAR], appNamespace);

export const NEW_MANGAS = defineAction('NEW_MANGAS',
  [REQUEST, SUCCESS, FAILURE, CLEAR], appNamespace);

export const MY_PIXIV = defineAction('MY_PIXIV',
  [REQUEST, SUCCESS, FAILURE, CLEAR], appNamespace);

export const TRENDING_ILLUST_TAGS = defineAction('TRENDING_ILLUST_TAGS',
  [REQUEST, SUCCESS, FAILURE, CLEAR], appNamespace);

export const RECOMMENDED_USERS = defineAction('RECOMMENDED_USERS',
  [REQUEST, SUCCESS, FAILURE, CLEAR], appNamespace);

export const SEARCH = defineAction('SEARCH',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL], appNamespace);

export const SEARCH_USERS = defineAction('SEARCH_USERS',
  [REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL], appNamespace);

export const SEARCH_AUTOCOMPLETE = defineAction('SEARCH_AUTOCOMPLETE',
  [REQUEST, SUCCESS, FAILURE, CLEAR], appNamespace);

export const SEARCH_USERS_AUTOCOMPLETE = defineAction('SEARCH_USERS_AUTOCOMPLETE',
  [REQUEST, SUCCESS, FAILURE, CLEAR], appNamespace);

export const BOOKMARK_TAGS = defineAction('BOOKMARK_TAGS',
  [REQUEST, SUCCESS, FAILURE, CLEAR], appNamespace);

export const ILLUST_BOOKMARK_DETAIL = defineAction('ILLUST_BOOKMARK_DETAIL',
  [REQUEST, SUCCESS, FAILURE, CLEAR], appNamespace);

export const BOOKMARK_ILLUST = defineAction('BOOKMARK_ILLUST',
  [REQUEST, SUCCESS, FAILURE], appNamespace);

export const UNBOOKMARK_ILLUST = defineAction('UNBOOKMARK_ILLUST',
  [REQUEST, SUCCESS, FAILURE], appNamespace);

export const USER_FOLLOW_DETAIL = defineAction('USER_FOLLOW_DETAIL',
  [REQUEST, SUCCESS, FAILURE, CLEAR], appNamespace);

export const FOLLOW_USER = defineAction('FOLLOW_USER',
  [REQUEST, SUCCESS, FAILURE], appNamespace);

export const UNFOLLOW_USER = defineAction('UNFOLLOW_USER',
  [REQUEST, SUCCESS, FAILURE], appNamespace);

export const SEARCH_HISTORY = defineAction('SEARCH_HISTORY',
  [ADD, REMOVE, CLEAR], appNamespace);

import { combineReducers } from 'redux';
import * as recommendedIllustReducers from './recommendedIllust';
import * as recommendedMangaReducers from './recommendedManga';
import * as relatedIllustReducers from './relatedIllust';
import * as trendingIllustTagReducers from './trendingIllustTag';
import * as recommendedUserReducers from './recommendedUser';
import * as illustCommentReducers from './illustComment';
import * as searchAutoCompleteReducers from './searchAutoComplete';
import createFilteredReducer from './createFilteredReducer';
import search from './search';
import searchUser from './searchUser';
import searchUserAutoComplete from './searchUserAutoComplete';
import searchHistory from './searchHistory';
import searchType from './searchType';
import userDetail from './userDetail';
import userIllust from './userIllust';
import userManga from './userManga';
import userBookmarkIllust from './userBookmarkIllust';
import myPrivateBookmarkIllust from './myPrivateBookmarkIllust';
import userFollowing from './userFollowing';
import userFollower from './userFollower';
import userMyPixiv from './userMyPixiv';
import bookmarkTag from './bookmarkTag';
import ranking from './ranking';
import followingUserIllust from './followingUserIllust';
import newIllust from './newIllust';
import newManga from './newManga';
import myPixiv from './myPixiv';
import bookmarkIllust from './bookmarkIllust';
import illustBookmarkDetail from './illustBookmarkDetail';
import userFollowDetail from './userFollowDetail';
import auth from './auth';
import routes from './routes';
import error from './error';
import { SortType } from '../actions/search';
import { RankingMode } from '../actions/ranking';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  error,
  ...recommendedIllustReducers,
  ...recommendedMangaReducers,
  ...relatedIllustReducers,
  ...trendingIllustTagReducers,
  ...recommendedUserReducers,
  ...illustCommentReducers,
  search,
  // searchNewest: createFilteredReducer(search, action => action.payload && action.payload.sortType === SortType.DESC),
  // searchOldest: createFilteredReducer(search, action => action.payload && action.payload.sortType === SortType.ASC),
  ranking,
  ...searchAutoCompleteReducers,
  searchUser,
  searchUserAutoComplete,
  searchHistory,
  searchType,
  userDetail,
  userIllust,
  userManga,
  userBookmarkIllust,
  myPrivateBookmarkIllust,
  userFollowing,
  userFollower,
  userFollowDetail,
  userMyPixiv,
  followingUserIllust,
  newIllust,
  newManga,
  myPixiv,
  bookmarkTag,
  bookmarkIllust,
  illustBookmarkDetail,
  auth,
  routes,
  form: formReducer,
});

export default rootReducer;
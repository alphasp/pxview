import { combineReducers } from 'redux';
import entities from './entities';
import recommendedIllusts from './recommendedIllusts';
import recommendedMangas from './recommendedMangas';
import relatedIllusts from './relatedIllusts';
import * as trendingIllustTagReducers from './trendingIllustTag';
import * as recommendedUserReducers from './recommendedUser';
import illustComments from './illustComments';
import * as searchAutoCompleteReducers from './searchAutoComplete';
import createFilteredReducer from './createFilteredReducer';
import search from './search';
import searchUser from './searchUser';
import searchUserAutoComplete from './searchUserAutoComplete';
import searchHistory from './searchHistory';
import searchType from './searchType';
import userDetail from './userDetail';
import userIllusts from './userIllusts';
import userMangas from './userMangas';
import userBookmarkIllusts from './userBookmarkIllusts';
import myPrivateBookmarkIllusts from './myPrivateBookmarkIllusts';
import userFollowing from './userFollowing';
import userFollowers from './userFollowers';
import userMyPixiv from './userMyPixiv';
import bookmarkTag from './bookmarkTag';
import ranking from './ranking';
import followingUserIllusts from './followingUserIllusts';
import newIllusts from './newIllusts';
import newMangas from './newMangas';
import myPixiv from './myPixiv';
import bookmarkIllust from './bookmarkIllust';
import illustBookmarkDetail from './illustBookmarkDetail';
import userFollowDetail from './userFollowDetail';
import auth from './auth';
import modal from './modal';
import i18n from './i18n';
import error from './error';
import { SortType } from '../actions/search';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  error,
  entities,
  recommendedIllusts,
  recommendedMangas,
  relatedIllusts,
  ...trendingIllustTagReducers,
  ...recommendedUserReducers,
  illustComments,
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
  userIllusts,
  userMangas,
  userBookmarkIllusts,
  myPrivateBookmarkIllusts,
  userFollowing,
  userFollowers,
  userFollowDetail,
  userMyPixiv,
  followingUserIllusts,
  newIllusts,
  newMangas,
  myPixiv,
  bookmarkTag,
  bookmarkIllust,
  illustBookmarkDetail,
  auth,
  modal,
  i18n,
  form: formReducer,
});

export default rootReducer;
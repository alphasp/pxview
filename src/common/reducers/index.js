import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import entities from './entities';
import recommendedIllusts from './recommendedIllusts';
import recommendedMangas from './recommendedMangas';
import relatedIllusts from './relatedIllusts';
import trendingIllustTags from './trendingIllustTags';
import recommendedUsers from './recommendedUsers';
import illustComments from './illustComments';
import searchAutoComplete from './searchAutoComplete';
import search from './search';
import searchUsers from './searchUsers';
import searchUsersAutoComplete from './searchUsersAutoComplete';
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
import bookmarkTags from './bookmarkTags';
import ranking from './ranking';
import followingUserIllusts from './followingUserIllusts';
import newIllusts from './newIllusts';
import newMangas from './newMangas';
import myPixiv from './myPixiv';
import bookmarkIllust from './bookmarkIllust';
import illustBookmarkDetail from './illustBookmarkDetail';
import userFollowDetail from './userFollowDetail';
import addIllustComment from './addIllustComment';
import browsingHistory from './browsingHistory';
import auth from './auth';
import modal from './modal';
import i18n from './i18n';
import error from './error';
import route from './route';
import keyboard from './keyboard';

const rootReducer = combineReducers({
  error,
  entities,
  recommendedIllusts,
  recommendedMangas,
  relatedIllusts,
  trendingIllustTags,
  recommendedUsers,
  illustComments,
  search,
  ranking,
  searchAutoComplete,
  searchUsers,
  searchUsersAutoComplete,
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
  bookmarkTags,
  bookmarkIllust,
  illustBookmarkDetail,
  addIllustComment,
  browsingHistory,
  auth,
  modal,
  i18n,
  route,
  keyboard,
  form: formReducer,
});

export default rootReducer;

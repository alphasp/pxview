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
import ranking from './ranking';
import routes from './routes';
import errorReducer from './error';
import { SortType } from '../actions/search';
import { RankingMode } from '../actions/ranking';
// import { reducer as formReducer} from 'redux-form';

const rootReducer = combineReducers({
  //form: formReducer,
  error: errorReducer,
  ...recommendedIllustReducers,
  ...recommendedMangaReducers,
  ...relatedIllustReducers,
  ...trendingIllustTagReducers,
  ...recommendedUserReducers,
  ...illustCommentReducers,
  searchNewest: createFilteredReducer(search, action => action.payload && action.payload.sortType === SortType.DESC),
  searchOldest: createFilteredReducer(search, action => action.payload && action.payload.sortType === SortType.ASC),
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
  routes,
});

export default rootReducer;
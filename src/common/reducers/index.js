import { combineReducers } from 'redux';
import * as recommendedIllustReducers from './recommendedIllust';
import * as recommendedMangaReducers from './recommendedManga';
import * as relatedIllustReducers from './relatedIllust';
import * as trendingIllustTagReducers from './trendingIllustTag';
import * as recommendedUserReducers from './recommendedUser';
import * as illustCommentReducers from './illustComment';
import * as searchReducers from './search';
import * as searchAutoCompleteReducers from './searchAutoComplete';
import searchUser from './searchUser';
import searchType from './searchType';
import routes from './routes';
import errorReducer from './error';
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
  ...searchReducers,
  ...searchAutoCompleteReducers,
  searchUser,
  searchType,
  routes
});

export default rootReducer;
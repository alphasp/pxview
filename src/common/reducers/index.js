import { combineReducers } from 'redux';
import * as recommendedIllustReducers from './recommendedIllust';
import * as recommendedMangaReducers from './recommendedManga';
import * as relatedIllustReducers from './relatedIllust';
import * as trendingIllustTagReducers from './trendingIllustTag';
import errorReducer from './error';
// import { reducer as formReducer} from 'redux-form';

const rootReducer = combineReducers({
  //form: formReducer,
  error: errorReducer,
  ...recommendedIllustReducers,
  ...recommendedMangaReducers,
  ...relatedIllustReducers,
  ...trendingIllustTagReducers
});

export default rootReducer;
import { watchLoginRequest, watchRehydrate } from './auth';
import { watchFetchRecommendedIllusts } from './recommendedIllusts';
import { watchFetchRecommendedMangas } from './recommendedMangas';

export default function* rootSaga() {
  yield [
    watchRehydrate(),
    watchLoginRequest(),
    watchFetchRecommendedIllusts(),
    watchFetchRecommendedMangas()
  ]
}
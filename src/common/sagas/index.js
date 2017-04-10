import { watchLoginRequest, watchRehydrate } from './auth';
import { watchFetchRecommendedIllusts } from './recommendedIllusts';
import { watchFetchRecommendedMangas } from './recommendedMangas';
import { watchFetchRelatedIllusts } from './relatedIllusts';
import { watchFetchIllustComments } from './illustComments';

export default function* rootSaga() {
  yield [
    watchRehydrate(),
    watchLoginRequest(),
    watchFetchRecommendedIllusts(),
    watchFetchRecommendedMangas(),
    watchFetchRelatedIllusts(),
    watchFetchIllustComments(),
  ]
}
import { watchLoginRequest, watchRehydrate } from './auth';
import { watchFetchRecommendedIllusts } from './recommendedIllusts';
import { watchFetchRecommendedMangas } from './recommendedMangas';
import { watchFetchRelatedIllusts } from './relatedIllusts';
import { watchFetchIllustComments } from './illustComments';
import { watchFetchRanking } from './ranking';
import { watchFetchUserDetail } from './userDetail';
import { watchFetchUserIllusts } from './userIllusts';
import { watchFetchUserMangas } from './userMangas';

export default function* rootSaga() {
  yield [
    watchRehydrate(),
    watchLoginRequest(),
    watchFetchRecommendedIllusts(),
    watchFetchRecommendedMangas(),
    watchFetchRelatedIllusts(),
    watchFetchIllustComments(),
    watchFetchRanking(),
    watchFetchUserDetail(),
    watchFetchUserIllusts(),
    watchFetchUserMangas(),
  ]
}
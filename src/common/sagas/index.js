import { watchLoginRequest, watchRehydrate } from './auth';
import { watchFetchRecommendedIllusts } from './recommendedIllusts';
import { watchFetchRecommendedMangas } from './recommendedMangas';
import { watchFetchRelatedIllusts } from './relatedIllusts';
import { watchFetchIllustComments } from './illustComments';
import { watchFetchRanking } from './ranking';
import { watchFetchUserDetail } from './userDetail';
import { watchFetchUserIllusts } from './userIllusts';
import { watchFetchUserMangas } from './userMangas';
import { watchFetchUserBookmarkIllusts } from './userBookmarkIllusts';
import { watchFetchUserFollowers } from './userFollowers';
import { watchFetchUserFollowing } from './userFollowing';
import { watchFetchUserMyPixiv } from './userMyPixiv';
import { watchFetchMyPrivateBookmarkIllusts } from './myPrivateBookmarkIllusts';
import { watchFetchFollowingUserIllusts } from './followingUserIllusts';
import { watchFetchNewIllusts } from './newIllusts';
import { watchFetchNewMangas } from './newMangas';
import { watchFetchMyPixiv } from './myPixiv';

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
    watchFetchUserBookmarkIllusts(),
    watchFetchUserFollowers(),
    watchFetchUserFollowing(),
    watchFetchUserMyPixiv(),
    watchFetchMyPrivateBookmarkIllusts(),
    watchFetchFollowingUserIllusts(),
    watchFetchNewIllusts(),
    watchFetchNewMangas(),
    watchFetchMyPixiv(),
  ]
}
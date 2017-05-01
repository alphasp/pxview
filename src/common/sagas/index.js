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
import { watchFetchTrendingIllustTags } from './trendingIllustTags';
import { watchFetchRecommendedUsers } from './recommendedUsers';
import { watchFetchSearch } from './search';
import { watchFetchSearchUsers } from './searchUsers';
import { watchFetchSearchAutoComplete } from './searchAutoComplete';
import { watchFetchSearchUsersAutoComplete } from './searchUsersAutoComplete';
import { watchFetchBookmarkTags } from './bookmarkTags';
import { watchFetchIllustBookmarkDetail } from './illustBookmarkDetail';
import { watchFetchUserFollowDetail } from './userFollowDetail';
import { watchBookmarkIllust, watchUnbookmarkIllust } from './bookmarkIllust';
import { watchFollowUser, watchUnfollowUser } from './followUser';

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
    watchFetchTrendingIllustTags(),
    watchFetchRecommendedUsers(),
    watchFetchSearch(),
    watchFetchSearchUsers(),
    watchFetchSearchAutoComplete(),
    watchFetchSearchUsersAutoComplete(),
    watchFetchBookmarkTags(),
    watchFetchIllustBookmarkDetail(),
    watchFetchUserFollowDetail(),
    watchBookmarkIllust(),
    watchUnbookmarkIllust(),
    watchFollowUser(),
    watchUnfollowUser(),
  ]
}
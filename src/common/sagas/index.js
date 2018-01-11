import { all } from 'redux-saga/effects';
import {
  watchLoginRequest,
  watchSignUpRequest,
  watchRefreshAccessTokenRequest,
  watchRehydrate,
} from './auth';
import { watchError } from './error';
import { watchFetchWalkthroughIllusts } from './walkthroughIllusts';
import { watchFetchRecommendedIllusts } from './recommendedIllusts';
import { watchFetchRecommendedMangas } from './recommendedMangas';
import { watchFetchRecommendedNovels } from './recommendedNovels';
import { watchFetchRelatedIllusts } from './relatedIllusts';
import { watchFetchIllustDetail } from './illustDetail';
import { watchFetchIllustComments } from './illustComments';
import { watchFetchNovelComments } from './novelComments';
import { watchFetchNovelSeries } from './novelSeries';
import { watchFetchNovelText } from './novelText';
import { watchFetchRanking } from './ranking';
import { watchFetchUserDetail } from './userDetail';
import { watchFetchUserIllusts } from './userIllusts';
import { watchFetchUserMangas } from './userMangas';
import { watchFetchUserBookmarkIllusts } from './userBookmarkIllusts';
import { watchFetchUserBookmarkNovels } from './userBookmarkNovels';
import { watchFetchUserFollowers } from './userFollowers';
import { watchFetchUserFollowing } from './userFollowing';
import { watchFetchUserMyPixiv } from './userMyPixiv';
import { watchFetchMyPrivateBookmarkIllusts } from './myPrivateBookmarkIllusts';
import { watchFetchMyPrivateBookmarkNovels } from './myPrivateBookmarkNovels';
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
import { watchFetchBookmarkIllustTags } from './bookmarkIllustTags';
import { watchFetchBookmarkNovelTags } from './bookmarkNovelTags';
import { watchFetchIllustBookmarkDetail } from './illustBookmarkDetail';
import { watchFetchNovelBookmarkDetail } from './novelBookmarkDetail';
import { watchFetchUserFollowDetail } from './userFollowDetail';
import { watchBookmarkIllust, watchUnbookmarkIllust } from './bookmarkIllust';
import { watchBookmarkNovel, watchUnbookmarkNovel } from './bookmarkNovel';
import { watchFollowUser, watchUnfollowUser } from './followUser';
import { watchAddIllustComment } from './addIllustComment';
import { watchFetchUgoiraMeta } from './ugoiraMeta';
import { watchFetchMyAccountState } from './myAccountState';
import { watchEditAccount } from './editAccount';
import { watchSendVerificationEmail } from './verificationEmail';

export default function* rootSaga() {
  yield all([
    watchRehydrate(),
    watchLoginRequest(),
    watchSignUpRequest(),
    watchError(),
    watchRefreshAccessTokenRequest(),
    watchFetchWalkthroughIllusts(),
    watchFetchRecommendedIllusts(),
    watchFetchRecommendedMangas(),
    watchFetchRecommendedNovels(),
    watchFetchRelatedIllusts(),
    watchFetchIllustDetail(),
    watchFetchIllustComments(),
    watchFetchNovelComments(),
    watchFetchNovelSeries(),
    watchFetchNovelText(),
    watchFetchRanking(),
    watchFetchUserDetail(),
    watchFetchUserIllusts(),
    watchFetchUserMangas(),
    watchFetchUserBookmarkIllusts(),
    watchFetchUserBookmarkNovels(),
    watchFetchUserFollowers(),
    watchFetchUserFollowing(),
    watchFetchUserMyPixiv(),
    watchFetchMyPrivateBookmarkIllusts(),
    watchFetchMyPrivateBookmarkNovels(),
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
    watchFetchBookmarkIllustTags(),
    watchFetchBookmarkNovelTags(),
    watchFetchIllustBookmarkDetail(),
    watchFetchNovelBookmarkDetail(),
    watchFetchUserFollowDetail(),
    watchBookmarkIllust(),
    watchUnbookmarkIllust(),
    watchBookmarkNovel(),
    watchUnbookmarkNovel(),
    watchFollowUser(),
    watchUnfollowUser(),
    watchAddIllustComment(),
    watchFetchUgoiraMeta(),
    watchFetchMyAccountState(),
    watchEditAccount(),
    watchSendVerificationEmail(),
  ]);
}

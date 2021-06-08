import { all, fork } from 'redux-saga/effects';
import { networkSaga } from 'react-native-offline';
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
import { watchFetchNovelDetail } from './novelDetail';
import { watchFetchIllustComments } from './illustComments';
import { watchFetchNovelComments } from './novelComments';
import { watchFetchIllustCommentReplies } from './illustCommentReplies';
import { watchFetchNovelCommentReplies } from './novelCommentReplies';
import { watchFetchNovelSeries } from './novelSeries';
import { watchFetchNovelText } from './novelText';
import { watchFetchRanking } from './ranking';
import { watchFetchUserDetail } from './userDetail';
import { watchFetchUserIllusts } from './userIllusts';
import { watchFetchUserMangas } from './userMangas';
import { watchFetchUserNovels } from './userNovels';
import { watchFetchUserBookmarkIllusts } from './userBookmarkIllusts';
import { watchFetchUserBookmarkNovels } from './userBookmarkNovels';
import { watchFetchUserFollowers } from './userFollowers';
import { watchFetchUserFollowing } from './userFollowing';
import { watchFetchUserMyPixiv } from './userMyPixiv';
import { watchFetchMyPrivateBookmarkIllusts } from './myPrivateBookmarkIllusts';
import { watchFetchMyPrivateBookmarkNovels } from './myPrivateBookmarkNovels';
import { watchFetchFollowingUserIllusts } from './followingUserIllusts';
import { watchFetchFollowingUserNovels } from './followingUserNovels';
import { watchFetchNewIllusts } from './newIllusts';
import { watchFetchNewMangas } from './newMangas';
import { watchFetchNewNovels } from './newNovels';
import { watchFetchMyPixivIllusts } from './myPixivIllusts';
import { watchFetchMyPixivNovels } from './myPixivNovels';
import { watchFetchTrendingIllustTags } from './trendingIllustTags';
import { watchFetchTrendingNovelTags } from './trendingNovelTags';
import { watchFetchRecommendedUsers } from './recommendedUsers';
import { watchFetchSearchIllusts } from './searchIllusts';
import { watchFetchSearchNovels } from './searchNovels';
import { watchFetchSearchUsers } from './searchUsers';
import { watchFetchSearchAutoComplete } from './searchAutoComplete';
import { watchFetchSearchUsersAutoComplete } from './searchUsersAutoComplete';
import { watchFetchSearchIllustsBookmarkRanges } from './searchIllustsBookmarkRanges';
import { watchFetchSearchNovelsBookmarkRanges } from './searchNovelsBookmarkRanges';
import { watchFetchBookmarkIllustTags } from './bookmarkIllustTags';
import { watchFetchBookmarkNovelTags } from './bookmarkNovelTags';
import { watchFetchIllustBookmarkDetail } from './illustBookmarkDetail';
import { watchFetchNovelBookmarkDetail } from './novelBookmarkDetail';
import { watchFetchUserFollowDetail } from './userFollowDetail';
import { watchBookmarkIllust, watchUnbookmarkIllust } from './bookmarkIllust';
import { watchBookmarkNovel, watchUnbookmarkNovel } from './bookmarkNovel';
import { watchFollowUser, watchUnfollowUser } from './followUser';
import { watchAddIllustComment } from './addIllustComment';
import { watchAddNovelComment } from './addNovelComment';
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
    watchFetchNovelDetail(),
    watchFetchIllustComments(),
    watchFetchNovelComments(),
    watchFetchIllustCommentReplies(),
    watchFetchNovelCommentReplies(),
    watchFetchNovelSeries(),
    watchFetchNovelText(),
    watchFetchRanking(),
    watchFetchUserDetail(),
    watchFetchUserIllusts(),
    watchFetchUserMangas(),
    watchFetchUserNovels(),
    watchFetchUserBookmarkIllusts(),
    watchFetchUserBookmarkNovels(),
    watchFetchUserFollowers(),
    watchFetchUserFollowing(),
    watchFetchUserMyPixiv(),
    watchFetchMyPrivateBookmarkIllusts(),
    watchFetchMyPrivateBookmarkNovels(),
    watchFetchFollowingUserIllusts(),
    watchFetchFollowingUserNovels(),
    watchFetchNewIllusts(),
    watchFetchNewMangas(),
    watchFetchNewNovels(),
    watchFetchMyPixivIllusts(),
    watchFetchMyPixivNovels(),
    watchFetchTrendingIllustTags(),
    watchFetchTrendingNovelTags(),
    watchFetchRecommendedUsers(),
    watchFetchSearchIllusts(),
    watchFetchSearchNovels(),
    watchFetchSearchUsers(),
    watchFetchSearchAutoComplete(),
    watchFetchSearchUsersAutoComplete(),
    watchFetchSearchIllustsBookmarkRanges(),
    watchFetchSearchNovelsBookmarkRanges(),
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
    watchAddNovelComment(),
    watchFetchUgoiraMeta(),
    watchFetchMyAccountState(),
    watchEditAccount(),
    watchSendVerificationEmail(),
    networkSaga({
      // pingInterval: 10000,
      pingOnlyIfOffline: true,
      // pingServerUrl: 'http://192.168.1.6:4000',
    }),
  ]);
}

import { combineReducers } from 'redux';
import { reducer as network } from 'react-native-offline';
import entities from './entities';
import walkthroughIllusts from './walkthroughIllusts';
import recommendedIllusts from './recommendedIllusts';
import recommendedMangas from './recommendedMangas';
import recommendedNovels from './recommendedNovels';
import relatedIllusts from './relatedIllusts';
import trendingIllustTags from './trendingIllustTags';
import trendingNovelTags from './trendingNovelTags';
import recommendedUsers from './recommendedUsers';
import illustDetail from './illustDetail';
import novelDetail from './novelDetail';
import illustComments from './illustComments';
import novelComments from './novelComments';
import illustCommentReplies from './illustCommentReplies';
import novelCommentReplies from './novelCommentReplies';
import novelSeries from './novelSeries';
import novelText from './novelText';
import searchAutoComplete from './searchAutoComplete';
import searchIllusts from './searchIllusts';
import searchNovels from './searchNovels';
import searchUsers from './searchUsers';
import searchUsersAutoComplete from './searchUsersAutoComplete';
import searchIllustsBookmarkRanges from './searchIllustsBookmarkRanges';
import searchNovelsBookmarkRanges from './searchNovelsBookmarkRanges';
import searchHistory from './searchHistory';
import userDetail from './userDetail';
import userIllusts from './userIllusts';
import userMangas from './userMangas';
import userNovels from './userNovels';
import userBookmarkIllusts from './userBookmarkIllusts';
import myPrivateBookmarkIllusts from './myPrivateBookmarkIllusts';
import myPrivateBookmarkNovels from './myPrivateBookmarkNovels';
import userBookmarkNovels from './userBookmarkNovels';
import userFollowing from './userFollowing';
import userFollowers from './userFollowers';
import userMyPixiv from './userMyPixiv';
import bookmarkIllustTags from './bookmarkIllustTags';
import bookmarkNovelTags from './bookmarkNovelTags';
import ranking from './ranking';
import followingUserIllusts from './followingUserIllusts';
import followingUserNovels from './followingUserNovels';
import newIllusts from './newIllusts';
import newMangas from './newMangas';
import newNovels from './newNovels';
import myPixivIllusts from './myPixivIllusts';
import myPixivNovels from './myPixivNovels';
import bookmarkIllust from './bookmarkIllust';
import illustBookmarkDetail from './illustBookmarkDetail';
import bookmarkNovel from './bookmarkNovel';
import novelBookmarkDetail from './novelBookmarkDetail';
import userFollowDetail from './userFollowDetail';
import addIllustComment from './addIllustComment';
import addNovelComment from './addNovelComment';
import ugoiraMeta from './ugoiraMeta';
import browsingHistoryIllusts from './browsingHistoryIllusts';
import browsingHistoryNovels from './browsingHistoryNovels';
import highlightTags from './highlightTags';
import muteSettings from './muteSettings';
import muteTags from './muteTags';
import muteUsers from './muteUsers';
import auth from './auth';
import myAccountState from './myAccountState';
import editAccount from './editAccount';
import verificationEmail from './verificationEmail';
import modal from './modal';
import saveImageSettings from './saveImageSettings';
import initialScreenSettings from './initialScreenSettings';
import novelSettings from './novelSettings';
import likeButtonSettings from './likeButtonSettings';
import readingSettings from './readingSettings';
import trendingSearchSettings from './trendingSearchSettings';
import i18n from './i18n';
import theme from './theme';
import error from './error';

const rootReducer = combineReducers({
  error,
  entities,
  walkthroughIllusts,
  recommendedIllusts,
  recommendedMangas,
  recommendedNovels,
  relatedIllusts,
  trendingIllustTags,
  trendingNovelTags,
  recommendedUsers,
  illustDetail,
  novelDetail,
  illustComments,
  novelComments,
  illustCommentReplies,
  novelCommentReplies,
  novelSeries,
  novelText,
  ranking,
  searchIllusts,
  searchNovels,
  searchAutoComplete,
  searchUsers,
  searchUsersAutoComplete,
  searchIllustsBookmarkRanges,
  searchNovelsBookmarkRanges,
  searchHistory,
  userDetail,
  userIllusts,
  userMangas,
  userNovels,
  userBookmarkIllusts,
  myPrivateBookmarkIllusts,
  userBookmarkNovels,
  myPrivateBookmarkNovels,
  userFollowing,
  userFollowers,
  userFollowDetail,
  userMyPixiv,
  followingUserIllusts,
  followingUserNovels,
  newIllusts,
  newMangas,
  newNovels,
  myPixivIllusts,
  myPixivNovels,
  bookmarkIllustTags,
  bookmarkNovelTags,
  bookmarkIllust,
  illustBookmarkDetail,
  bookmarkNovel,
  novelBookmarkDetail,
  addIllustComment,
  addNovelComment,
  ugoiraMeta,
  browsingHistoryIllusts,
  browsingHistoryNovels,
  highlightTags,
  muteSettings,
  muteTags,
  muteUsers,
  auth,
  myAccountState,
  editAccount,
  verificationEmail,
  modal,
  saveImageSettings,
  initialScreenSettings,
  novelSettings,
  likeButtonSettings,
  readingSettings,
  trendingSearchSettings,
  i18n,
  theme,
  network,
});

export default rootReducer;

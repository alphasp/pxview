import Detail from '../../screens/Shared/Detail';
import NovelDetail from '../../screens/Shared/NovelDetail';
import UserDetail from '../../screens/Shared/UserDetail';
import IllustComments from '../../screens/Shared/IllustComments';
import NovelComments from '../../screens/Shared/NovelComments';
import NovelSeries from '../../screens/Shared/NovelSeries';
import NovelReader from '../../screens/Shared/NovelReader';
import UserIllusts from '../../screens/Shared/UserIllusts';
import UserMangas from '../../screens/Shared/UserMangas';
import UserNovels from '../../screens/Shared/UserNovels';
import UserBookmarkIllusts from '../../screens/Shared/UserBookmarkIllusts';
import UserBookmarkNovels from '../../screens/Shared/UserBookmarkNovels';
import UserFollowing from '../../screens/MyPage/MyConnection/UserFollowing';
import UserMyPixiv from '../../screens/MyPage/MyConnection/UserMyPixiv';
import RelatedIllusts from '../../screens/Shared/RelatedIllusts';
import SearchResultTabs from '../../screens/Shared/SearchResultTabs';
import RecommendedUsers from '../../screens/Shared/RecommendedUsers';
import ImagesViewer from '../../screens/Shared/ImagesViewer';
import { getThemedHeaderStyle } from '../../styles';
import { SCREENS } from '../../common/constants';

const config = {
  [SCREENS.Detail]: {
    screen: Detail,
    path: '(member_illust.php|illusts|artworks|en/artworks)/:illustId?',
    options: {
      header: null,
    },
  },
  [SCREENS.NovelDetail]: {
    screen: NovelDetail,
    path: '(novel/show.php|novels)/:novelId?',
    options: {
      header: null,
    },
  },
  [SCREENS.UserDetail]: {
    screen: UserDetail,
    path: '(member.php|users)/:uid?',
    options: {
      header: null,
    },
  },
  [SCREENS.ImagesViewer]: {
    screen: ImagesViewer,
    options: {
      header: null,
    },
  },
  [SCREENS.NovelReader]: {
    screen: NovelReader,
    options: {
      header: null,
    },
  },
  [SCREENS.IllustComments]: {
    screen: IllustComments,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.comments,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.NovelComments]: {
    screen: NovelComments,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.comments,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.NovelSeries]: {
    screen: NovelSeries,
    // options: ({ screenProps: { i18n, theme } }) => ({
    //   title: i18n.comments,
    // }),
  },
  [SCREENS.RelatedIllusts]: {
    screen: RelatedIllusts,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.relatedWorks,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.UserIllusts]: {
    screen: UserIllusts,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.userIllusts,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.UserMangas]: {
    screen: UserMangas,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.userMangas,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.UserNovels]: {
    screen: UserNovels,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.userNovels,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.UserBookmarkIllusts]: {
    screen: UserBookmarkIllusts,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.collection,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.UserBookmarkNovels]: {
    screen: UserBookmarkNovels,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.collection,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.UserFollowing]: {
    screen: UserFollowing,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.following,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.UserMyPixiv]: {
    screen: UserMyPixiv,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.myPixiv,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.SearchResult]: {
    screen: SearchResultTabs,
    options: {
      header: null,
    },
  },
  [SCREENS.RecommendedUsers]: {
    screen: RecommendedUsers,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.recommendedUsers,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
};

export default config;

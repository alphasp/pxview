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
    navigationOptions: {
      header: null,
    },
  },
  [SCREENS.NovelDetail]: {
    screen: NovelDetail,
    path: '(novel/show.php|novels)/:novelId?',
    navigationOptions: {
      header: null,
    },
  },
  [SCREENS.UserDetail]: {
    screen: UserDetail,
    path: '(member.php|users)/:uid?',
    navigationOptions: {
      header: null,
    },
  },
  [SCREENS.ImagesViewer]: {
    screen: ImagesViewer,
    navigationOptions: {
      header: null,
    },
  },
  [SCREENS.NovelReader]: {
    screen: NovelReader,
    navigationOptions: {
      header: null,
    },
  },
  [SCREENS.IllustComments]: {
    screen: IllustComments,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.comments,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.NovelComments]: {
    screen: NovelComments,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.comments,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.NovelSeries]: {
    screen: NovelSeries,
    // navigationOptions: ({ screenProps: { i18n, theme } }) => ({
    //   title: i18n.comments,
    // }),
  },
  [SCREENS.RelatedIllusts]: {
    screen: RelatedIllusts,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.relatedWorks,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.UserIllusts]: {
    screen: UserIllusts,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.userIllusts,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.UserMangas]: {
    screen: UserMangas,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.userMangas,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.UserNovels]: {
    screen: UserNovels,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.userNovels,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.UserBookmarkIllusts]: {
    screen: UserBookmarkIllusts,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.collection,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.UserBookmarkNovels]: {
    screen: UserBookmarkNovels,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.collection,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.UserFollowing]: {
    screen: UserFollowing,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.following,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.UserMyPixiv]: {
    screen: UserMyPixiv,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.myPixiv,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.SearchResult]: {
    screen: SearchResultTabs,
    navigationOptions: {
      header: null,
    },
  },
  [SCREENS.RecommendedUsers]: {
    screen: RecommendedUsers,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.recommendedUsers,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
};

export default config;

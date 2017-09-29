import Detail from '../../screens/Shared/Detail';
import UserDetail from '../../screens/Shared/UserDetail';
import IllustComments from '../../screens/Shared/IllustComments';
import UserIllusts from '../../screens/Shared/UserIllusts';
import UserMangas from '../../screens/Shared/UserMangas';
import UserBookmarkIllusts from '../../screens/Shared/UserBookmarkIllusts';
import RelatedIllusts from '../../screens/Shared/RelatedIllusts';
import SearchResultTabs from '../../screens/Shared/SearchResultTabs';
import RecommendedUsers from '../../screens/Shared/RecommendedUsers';
import { SCREENS } from '../../common/constants';

const config = {
  [SCREENS.Detail]: {
    screen: Detail,
    path: '(member_illust.php|illusts)/:illustId?',
    navigationOptions: {
      header: null,
    },
  },
  [SCREENS.UserDetail]: {
    screen: UserDetail,
    path: '(member.php|user)/:uid?',
    navigationOptions: {
      header: null,
    },
  },
  [SCREENS.IllustComments]: {
    screen: IllustComments,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.comments,
    }),
  },
  [SCREENS.RelatedIllusts]: {
    screen: RelatedIllusts,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.relatedWorks,
    }),
  },
  [SCREENS.UserIllusts]: {
    screen: UserIllusts,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.userIllusts,
    }),
  },
  [SCREENS.UserMangas]: {
    screen: UserMangas,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.userMangas,
    }),
  },
  [SCREENS.UserBookmarkIllusts]: {
    screen: UserBookmarkIllusts,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.collection,
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
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.recommendedUsers,
    }),
  },
};

export default config;

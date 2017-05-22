import Detail from '../../screens/Shared/Detail';
import UserDetail from '../../screens/Shared/UserDetail';
import IllustComments from '../../screens/Shared/IllustComments';
import UserIllusts from '../../screens/Shared/UserIllusts';
import UserMangas from '../../screens/Shared/UserMangas';
import UserBookmarkIllusts from '../../screens/Shared/UserBookmarkIllusts';
import RelatedIllusts from '../../screens/Shared/RelatedIllusts';
import SearchResultTabs from '../../screens/Shared/SearchResultTabs';
import RecommendedUsers from '../../screens/Shared/RecommendedUsers';

const config = {
  Detail: {
    screen: Detail,
  },
  UserDetail: {
    screen: UserDetail,
  },
  IllustComments: {
    screen: IllustComments,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.comments,
    }),
  },
  RelatedIllusts: {
    screen: RelatedIllusts,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.relatedWorks,
    }),
  },
  UserIllusts: {
    screen: UserIllusts,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.userIllusts,
    }),
  },
  UserMangas: {
    screen: UserMangas,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.userMangas,
    }),
  },
  UserBookmarkIllusts: {
    screen: UserBookmarkIllusts,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.collection,
    }),
  },
  SearchResult: {
    screen: SearchResultTabs,
  },
  RecommendedUsers: {
    screen: RecommendedUsers,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.recommendedUsers,
    }),
  },
};

export default config;

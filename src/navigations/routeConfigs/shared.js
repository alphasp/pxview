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
    navigationOptions: {
      title: 'User Comments',
    },
  },
  RelatedIllusts: {
    screen: RelatedIllusts,
    navigationOptions: {
      title: 'Related Works',
    },
  },
  UserIllusts: {
    screen: UserIllusts,
    navigationOptions: {
      title: 'User Illusts',
    },
  },
  UserMangas: {
    screen: UserMangas,
    navigationOptions: {
      title: 'User Mangas',
    },
  },
  UserBookmarkIllusts: {
    screen: UserBookmarkIllusts,
    navigationOptions: {
      title: 'Collection',
    },
  },
  SearchResult: {
    screen: SearchResultTabs,
  },
  RecommendedUsers: {
    screen: RecommendedUsers,
    navigationOptions: {
      title: 'Recommended Users',
    },
  },
};

export default config;

import { StackNavigator } from 'react-navigation';
import UserProfile from '../containers/UserProfile';
import MyWorks from '../containers/MyWorks';
import MyConnection from '../containers/MyConnection';
import MyCollection from '../containers/MyCollection';
import Detail from '../containers/Detail';
import UserDetail from '../containers/UserDetail';
import IllustComments from '../containers/IllustComments';
import UserIllusts from '../containers/UserIllusts';
import UserMangas from '../containers/UserMangas';
import UserBookmarkIllusts from '../containers/UserBookmarkIllusts';
import RelatedIllusts from '../containers/RelatedIllusts';
import SearchResultTabs from '../containers/SearchResultTabs'; //todo

const UserProfileNavigator = StackNavigator({
  UserProfile: { 
    screen: UserProfile,
    navigationOptions: {
      headerVisible: false
    },
  },
  MyConnection: {
    screen: MyConnection,
    path: '/me/connection',
    navigationOptions: {
      title: "Connection",
    },
  },
  MyCollection: {
    screen: MyCollection,
    path: '/me/collection',
    navigationOptions: {
      title: "Collection",
    },
  },
  MyWorks: {
    screen: MyWorks,
    navigationOptions: {
      title: 'My Works',
    },
  },
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
    }
  },
  UserMangas: {
    screen: UserMangas,
    navigationOptions: {
      title: 'User Mangas',
    }
  },
  UserBookmarkIllusts: {
    screen: UserBookmarkIllusts,
    navigationOptions: {
      title: 'Collection',
    }
  },
  SearchResult: {
    screen: SearchResultTabs,
  }
}, {
  headerMode: 'screen',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#fff',
    }
  },
  cardStyle: {
    backgroundColor: '#fff'
  },
});

export default UserProfileNavigator;
import { StackNavigator } from 'react-navigation';
import UserProfile from '../containers/UserProfile';
import MyWorks from '../containers/MyWorks';
import MyConnection from '../containers/MyConnection';
import MyCollection from '../containers/MyCollection';
import Detail from '../containers/Detail';
import UserDetail from '../containers/UserDetail';
import IllustComments from '../containers/IllustComments';
import UserIllust from '../containers/UserIllust';
import UserManga from '../containers/UserManga';
import UserBookmarkIllust from '../containers/UserBookmarkIllust';
import RelatedIllusts from '../containers/RelatedIllusts';
import SearchResultTabs from '../containers/SearchResultTabs'; //todo

const UserProfileNavigator = StackNavigator({
  UserProfile: { 
    screen: UserProfile,
    path: '/',
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
  UserIllust: {
    screen: UserIllust,
    navigationOptions: {
      title: 'User Illusts',
    }
  },
  UserManga: {
    screen: UserManga,
    navigationOptions: {
      title: 'User Mangas',
    }
  },
  UserBookmarkIllust: {
    screen: UserBookmarkIllust,
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
    header: ({ state, setParams }, defaultHeader) => ({
      ...defaultHeader,
      style: {
        backgroundColor: '#fff',
      },
    }),
  },
  cardStyle: {
    backgroundColor: '#fff'
  },
});

export default UserProfileNavigator;
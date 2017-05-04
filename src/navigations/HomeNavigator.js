import { StackNavigator } from 'react-navigation';
import Home from '../containers/Home';
import Detail from '../containers/Detail';
import UserDetail from '../containers/UserDetail';
import IllustComments from '../containers/IllustComments';
import UserIllusts from '../containers/UserIllusts';
import UserMangas from '../containers/UserMangas';
import UserBookmarkIllusts from '../containers/UserBookmarkIllusts';
import RelatedIllusts from '../containers/RelatedIllusts';
import SearchResultTabs from '../containers/SearchResultTabs'; // todo

const HomeNavigator = StackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        header: null,
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
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerBackTitle: null,
    },
    cardStyle: {
      backgroundColor: '#fff',
    },
    headerMode: 'screen',
  },
);

export default HomeNavigator;

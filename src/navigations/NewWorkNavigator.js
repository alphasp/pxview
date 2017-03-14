import { StackNavigator } from 'react-navigation';
import NewWork from '../containers/NewWork';
import Detail from '../containers/Detail';
import UserDetail from '../containers/UserDetail';
import IllustComment from '../containers/IllustComment';
import UserIllust from '../containers/UserIllust';
import UserManga from '../containers/UserManga';
import UserBookmarkIllust from '../containers/UserBookmarkIllust';
import RelatedIllust from '../containers/RelatedIllust';
import SearchResultTabs from '../containers/SearchResultTabs'; //todo

const NewWorkNavigator = StackNavigator({
  NewWork: { 
    screen: NewWork,
    navigationOptions: {
      header: {
        visible: false
      }
    },
  },
  Detail: { 
    screen: Detail,
  },
  UserDetail: {
    screen: UserDetail,
  },
  IllustComment: {
    screen: IllustComment,
    navigationOptions: {
      title: 'User Comments',
    },
  },
  RelatedIllust: {
    screen: RelatedIllust,
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
  headerMode: 'screen'
});

export default NewWorkNavigator;
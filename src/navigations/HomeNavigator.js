import { StackNavigator } from 'react-navigation';
import Home from '../containers/Home';
import Detail from '../containers/Detail';
import UserDetail from '../containers/UserDetail';
import RelatedIllust from '../containers/RelatedIllust';
import SearchResultTabs from '../containers/SearchResultTabs'; //todo

const HomeNavigator = StackNavigator({
  Home: { 
    screen: Home,
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
  RelatedIllust: {
    screen: RelatedIllust,
    navigationOptions: {
      title: "Related Works",
    },
  },
  SearchResult: {
    screen: SearchResultTabs,
  }
}, {
  navigationOptions: {
    header: {
      style: {
        backgroundColor: '#fff'
      }
    }
  },
  cardStyle: {
    backgroundColor: '#fff'
  },
  headerMode: 'screen',
});

export default HomeNavigator;
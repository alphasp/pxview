import { StackNavigator } from 'react-navigation';
import Trending from '../containers/Trending';
import Detail from '../containers/Detail';
import RelatedIllust from '../containers/RelatedIllust';
import Search from '../containers/Search';
import SearchResultTabs from '../containers/SearchResultTabs'; //todo

const TrendingNavigator = StackNavigator({
  Trending: { 
    screen: Trending,
    path: '/',
    navigationOptions: {
      header: {
        visible: false,
      }
    },
  },
  Detail: { 
    screen: Detail,
    path: '/detail'
  },
  RelatedIllust: {
    screen: RelatedIllust,
    path: '/relatedillust',
    navigationOptions: {
      title: 'Related Works',
    },
  },
  Search: {
    screen: Search
  },
  SearchResult: {
    screen: SearchResultTabs,
  },
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

export default TrendingNavigator;
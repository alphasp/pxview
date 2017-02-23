import { StackNavigator } from 'react-navigation';
import UserProfile from '../containers/UserProfile';
import MyConnection from '../containers/MyConnection';
import MyCollection from '../containers/MyCollection';
import Detail from '../containers/Detail';
import IllustComment from '../containers/IllustComment';
import RelatedIllust from '../containers/RelatedIllust';
import MyWorks from '../containers/MyWorks';

const UserProfileNavigator = StackNavigator({
  UserProfile: { 
    screen: UserProfile,
    path: '/',
    navigationOptions: {
      title: "Profile",
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
  Detail: { 
    screen: Detail,
    path: '/detail'
  },
  IllustComment: {
    screen: IllustComment,
    navigationOptions: {
      title: "User Comments",
    },
  },
  RelatedIllust: {
    screen: RelatedIllust,
    path: '/relatedillust',
    navigationOptions: {
      title: 'Related Works',
    },
  },
  MyWorks: {
    screen: MyWorks,
    navigationOptions: {
      title: 'My Works',
    },
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
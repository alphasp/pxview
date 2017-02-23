import { StackNavigator } from 'react-navigation';
import NewWork from '../containers/NewWork';
import IllustComment from '../containers/IllustComment';
import Detail from '../containers/Detail';

const NewWorkNavigator = StackNavigator({
  NewWork: { 
    screen: NewWork,
    path: '/',
    navigationOptions: {
      title: "New",
    },
  },
  IllustComment: {
    screen: IllustComment,
    navigationOptions: {
      title: "User Comments",
    },
  },
  Detail: { 
    screen: Detail,
    path: '/detail'
  },
}, {
  headerMode: "none",
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

export default NewWorkNavigator;
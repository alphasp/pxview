import { StackNavigator } from 'react-navigation';
import NewWork from '../containers/NewWork';
import Detail from '../containers/Detail';

const NewWorkNavigator = StackNavigator({
  NewWork: { 
    screen: NewWork,
    path: '/',
    navigationOptions: {
      title: "New",
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
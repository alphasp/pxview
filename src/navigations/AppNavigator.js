import { Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';
import enhanceRouter from './routers/enhanceRouter';
import MainNavigator from './MainNavigator';
import Login from '../screens/Login/Login';
import SearchFilterModal from '../components/SearchFilterModal';
import ImagesViewer from '../screens/ImagesViewer/ImagesViewer';
import AddIllustComment from '../screens/Shared/AddIllustComment';
import myPageRouteConfig from './routeConfigs/myPage';
import sharedRouteConfig from './routeConfigs/shared';
import { globalStyles, globalStyleVariables } from '../styles';

let appRouteConfig = {
  Main: {
    screen: MainNavigator,
    navigationOptions: {
      header: null,
    },
  },
  Login: {
    screen: Login,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.login,
    }),
  },
  SearchFilterModal: {
    screen: SearchFilterModal,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.displayOptions,
    }),
  },
  ImagesViewer: {
    screen: ImagesViewer,
  },
  AddIllustComment: {
    screen: AddIllustComment,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.addComment,
    }),
  },
};

if (Platform.OS === 'android') {
  appRouteConfig = {
    ...appRouteConfig,
    ...myPageRouteConfig,
    ...sharedRouteConfig,
  };
}

const AppNavigator = StackNavigator(appRouteConfig, {
  navigationOptions: {
    headerStyle: {
      backgroundColor: globalStyleVariables.HEADER_BACKGROUND_COLOR,
    },
    headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
  },
  cardStyle: globalStyles.card,
  mode: 'modal',
  headerMode: 'screen',
});

export default enhanceRouter(AppNavigator);

import { Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';
import AppTabNavigator from './AppTabNavigator';
import AppDrawerNavigator from './AppDrawerNavigator';
import Login from '../screens/Login/Login';
import SearchFilterModal from '../components/SearchFilterModal';
import ImagesViewer from '../screens/ImagesViewer/ImagesViewer';
import AddIllustComment from '../screens/Shared/AddIllustComment';
import myPageRouteConfig from './routeConfigs/myPage';
import { globalStyles, globalStyleVariables } from '../styles';
import config from '../common/config';

let appRouteConfig = {
  Main: {
    screen: config.navigation.tab ? AppTabNavigator : AppDrawerNavigator,
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
      title: i18n.searchDisplayOptions,
    }),
  },
  ImagesViewer: {
    screen: ImagesViewer,
  },
  AddIllustComment: {
    screen: AddIllustComment,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.commentAdd,
    }),
  },
};

if (!config.navigation.tab) {
  appRouteConfig = {
    ...appRouteConfig,
    ...myPageRouteConfig,
  };
}

const stackConfig = {
  navigationOptions: {
    headerStyle: {
      backgroundColor: globalStyleVariables.HEADER_BACKGROUND_COLOR,
    },
    headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
    headerBackTitle: null,
  },
  cardStyle: globalStyles.card,
  mode: 'modal',
  headerMode: 'screen',
};

const AppNavigator = StackNavigator(appRouteConfig, stackConfig);

export default AppNavigator;

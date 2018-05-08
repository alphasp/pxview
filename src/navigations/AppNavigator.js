import { createStackNavigator } from 'react-navigation';
import createAppTabNavigator from './AppTabNavigator';
import createAppDrawerNavigator from './AppDrawerNavigator';
import enhanceRouter from './routers/enhanceRouter';
import SearchFilterModal from '../screens/Shared/SearchFilterModal';
import SearchFilterPeriodDateModal from '../screens/Shared/SearchFilterPeriodDateModal';
import AddIllustComment from '../screens/Shared/AddIllustComment';
import AddNovelComment from '../screens/Shared/AddNovelComment';
import ReplyIllustComment from '../screens/Shared/ReplyIllustComment';
import ReplyNovelComment from '../screens/Shared/ReplyNovelComment';
import AccountSettings from '../screens/MyPage/AccountSettings/AccountSettings';
import Encyclopedia from '../screens/Shared/Encyclopedia';
import myPageRouteConfig from './routeConfigs/myPage';
import sharedRouteConfig from './routeConfigs/shared';
import { globalStyles, globalStyleVariables } from '../styles';
import config from '../common/config';
import { SCREENS } from '../common/constants';

const stackConfig = {
  navigationOptions: {
    headerStyle: globalStyles.header,
    headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
    headerBackTitle: null,
  },
  cardStyle: globalStyles.card,
  headerMode: 'screen',
};

const createAppNavigator = ({ initialRouteName }) => {
  const AppNavigator = createStackNavigator(
    {
      [SCREENS.Main]: {
        screen: config.navigation.tab
          ? createAppTabNavigator({ initialRouteName })
          : createAppDrawerNavigator({ initialRouteName }),
        navigationOptions: {
          header: null,
        },
      },
      [SCREENS.SearchFilterModal]: {
        screen: SearchFilterModal,
        navigationOptions: ({ screenProps: { i18n } }) => ({
          title: i18n.searchDisplayOptions,
        }),
      },
      [SCREENS.SearchFilterPeriodDateModal]: {
        screen: SearchFilterPeriodDateModal,
        navigationOptions: ({ screenProps: { i18n } }) => ({
          title: i18n.searchPeriodSpecifyDate,
        }),
      },
      [SCREENS.AddIllustComment]: {
        screen: AddIllustComment,
        navigationOptions: ({ screenProps: { i18n } }) => ({
          title: i18n.commentAdd,
        }),
      },
      [SCREENS.AddNovelComment]: {
        screen: AddNovelComment,
        navigationOptions: ({ screenProps: { i18n } }) => ({
          title: i18n.commentAdd,
        }),
      },
      [SCREENS.ReplyIllustComment]: {
        screen: ReplyIllustComment,
        navigationOptions: ({ screenProps: { i18n } }) => ({
          title: i18n.commentAdd,
        }),
      },
      [SCREENS.ReplyNovelComment]: {
        screen: ReplyNovelComment,
        navigationOptions: ({ screenProps: { i18n } }) => ({
          title: i18n.commentAdd,
        }),
      },
      [SCREENS.AccountSettingsModal]: {
        screen: AccountSettings,
        navigationOptions: ({ screenProps: { i18n } }) => ({
          title: i18n.accountSettings,
        }),
      },
      [SCREENS.Encyclopedia]: {
        screen: Encyclopedia,
      },
      ...myPageRouteConfig,
      ...sharedRouteConfig,
    },
    stackConfig,
  );
  const Navigator = enhanceRouter(AppNavigator);
  return Navigator;
};

export default createAppNavigator;

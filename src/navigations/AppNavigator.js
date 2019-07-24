import { createAppContainer, createStackNavigator } from 'react-navigation';
import createAppTabNavigator from './AppTabNavigator';
import createAppDrawerNavigator from './AppDrawerNavigator';
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
import {
  globalStyles,
  globalStyleVariables,
  getThemedHeaderStyle,
} from '../styles';
import config from '../common/config';
import { SCREENS } from '../common/constants';

const stackConfig = {
  defaultNavigationOptions: {
    // headerStyle: globalStyles.header,
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
        navigationOptions: ({ screenProps: { i18n, theme } }) => ({
          title: i18n.searchDisplayOptions,
          headerStyle: getThemedHeaderStyle(theme),
        }),
      },
      [SCREENS.SearchFilterPeriodDateModal]: {
        screen: SearchFilterPeriodDateModal,
        navigationOptions: ({ screenProps: { i18n, theme } }) => ({
          title: i18n.searchPeriodSpecifyDate,
          headerStyle: getThemedHeaderStyle(theme),
        }),
      },
      [SCREENS.AddIllustComment]: {
        screen: AddIllustComment,
        navigationOptions: ({ screenProps: { i18n, theme } }) => ({
          title: i18n.commentAdd,
          headerStyle: getThemedHeaderStyle(theme),
        }),
      },
      [SCREENS.AddNovelComment]: {
        screen: AddNovelComment,
        navigationOptions: ({ screenProps: { i18n, theme } }) => ({
          title: i18n.commentAdd,
          headerStyle: getThemedHeaderStyle(theme),
        }),
      },
      [SCREENS.ReplyIllustComment]: {
        screen: ReplyIllustComment,
        navigationOptions: ({ screenProps: { i18n, theme } }) => ({
          title: i18n.commentAdd,
          headerStyle: getThemedHeaderStyle(theme),
        }),
      },
      [SCREENS.ReplyNovelComment]: {
        screen: ReplyNovelComment,
        navigationOptions: ({ screenProps: { i18n, theme } }) => ({
          title: i18n.commentAdd,
          headerStyle: getThemedHeaderStyle(theme),
        }),
      },
      [SCREENS.AccountSettingsModal]: {
        screen: AccountSettings,
        navigationOptions: ({ screenProps: { i18n, theme } }) => ({
          title: i18n.accountSettings,
          headerStyle: getThemedHeaderStyle(theme),
        }),
      },
      [SCREENS.Encyclopedia]: {
        screen: Encyclopedia,
        navigationOptions: ({ screenProps: { theme } }) => ({
          headerStyle: getThemedHeaderStyle(theme),
        }),
      },
      ...myPageRouteConfig,
      ...sharedRouteConfig,
    },
    stackConfig,
  );
  return createAppContainer(AppNavigator);
};

export default createAppNavigator;

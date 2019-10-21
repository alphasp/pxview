import MyWorks from '../../screens/MyPage/MyWorks';
import MyConnection from '../../screens/MyPage/MyConnection/MyConnection';
import MyCollection from '../../screens/MyPage/MyCollection/MyCollection';
import BrowsingHistory from '../../screens/MyPage/BrowsingHistory/BrowsingHistory';
import Settings from '../../screens/MyPage/Settings';
import AccountSettings from '../../screens/MyPage/AccountSettings/AccountSettings';
import AdvanceAccountSettings from '../../screens/MyPage/AccountSettings/AdvanceAccountSettings';
import SaveImageSettings from '../../screens/MyPage/SaveImageSettings';
import LikeButtonSettings from '../../screens/MyPage/LikeButtonSettings';
import HighlightTagsSettings from '../../screens/MyPage/HighlightTagsSettings';
import MuteSettings from '../../screens/MyPage/MuteSettings/MuteSettings';
import MuteTagsSettings from '../../screens/MyPage/MuteSettings/MuteTagsSettings';
import MuteUsersSettings from '../../screens/MyPage/MuteSettings/MuteUsersSettings';
import Feedback from '../../screens/MyPage/Feedback';
import PrivacyPolicy from '../../screens/MyPage/PrivacyPolicy';
import About from '../../screens/MyPage/About';
import { globalStyles, getThemedHeaderStyle } from '../../styles';
import { SCREENS } from '../../common/constants';

const config = {
  [SCREENS.MyConnection]: {
    screen: MyConnection,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.connection,
      headerStyle: {
        ...getThemedHeaderStyle(theme),
        ...globalStyles.headerWithoutShadow,
      },
    }),
  },
  [SCREENS.MyCollection]: {
    screen: MyCollection,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.collection,
      headerStyle: {
        ...getThemedHeaderStyle(theme),
        ...globalStyles.headerWithoutShadow,
      },
    }),
  },
  [SCREENS.MyWorks]: {
    screen: MyWorks,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.myWorks,
      headerStyle: {
        ...getThemedHeaderStyle(theme),
        ...globalStyles.headerWithoutShadow,
      },
    }),
  },
  [SCREENS.BrowsingHistory]: {
    screen: BrowsingHistory,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.browsingHistory,
      headerStyle: {
        ...getThemedHeaderStyle(theme),
        ...globalStyles.headerWithoutShadow,
      },
    }),
  },
  [SCREENS.Settings]: {
    screen: Settings,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.settings,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.AccountSettings]: {
    screen: AccountSettings,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.accountSettings,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.AdvanceAccountSettings]: {
    screen: AdvanceAccountSettings,
    navigationOptions: ({ screenProps: { theme } }) => ({
      title: null,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.SaveImageSettings]: {
    screen: SaveImageSettings,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.saveImageSettings,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.LikeButtonSettings]: {
    screen: LikeButtonSettings,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.likeButtonSettings,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.HighlightTagsSettings]: {
    screen: HighlightTagsSettings,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.tagHighlightSettings,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.MuteSettings]: {
    screen: MuteSettings,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.muteSettings,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.MuteTagsSettings]: {
    screen: MuteTagsSettings,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.tagMuteSettings,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.MuteUsersSettings]: {
    screen: MuteUsersSettings,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.userMuteSettings,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.Feedback]: {
    screen: Feedback,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.feedback,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.PrivacyPolicy]: {
    screen: PrivacyPolicy,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.privacyPolicy,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.About]: {
    screen: About,
    navigationOptions: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.about,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
};

export default config;

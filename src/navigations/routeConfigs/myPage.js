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
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.connection,
      headerStyle: {
        ...getThemedHeaderStyle(theme),
        ...globalStyles.headerWithoutShadow,
      },
    }),
  },
  [SCREENS.MyCollection]: {
    screen: MyCollection,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.collection,
      headerStyle: {
        ...getThemedHeaderStyle(theme),
        ...globalStyles.headerWithoutShadow,
      },
    }),
  },
  [SCREENS.MyWorks]: {
    screen: MyWorks,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.myWorks,
      headerStyle: {
        ...getThemedHeaderStyle(theme),
        ...globalStyles.headerWithoutShadow,
      },
    }),
  },
  [SCREENS.BrowsingHistory]: {
    screen: BrowsingHistory,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.browsingHistory,
      headerStyle: {
        ...getThemedHeaderStyle(theme),
        ...globalStyles.headerWithoutShadow,
      },
    }),
  },
  [SCREENS.Settings]: {
    screen: Settings,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.settings,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.AccountSettings]: {
    screen: AccountSettings,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.accountSettings,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.AdvanceAccountSettings]: {
    screen: AdvanceAccountSettings,
    options: ({ screenProps: { theme } }) => ({
      title: null,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.SaveImageSettings]: {
    screen: SaveImageSettings,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.saveImageSettings,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.LikeButtonSettings]: {
    screen: LikeButtonSettings,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.likeButtonSettings,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.HighlightTagsSettings]: {
    screen: HighlightTagsSettings,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.tagHighlightSettings,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.MuteSettings]: {
    screen: MuteSettings,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.muteSettings,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.MuteTagsSettings]: {
    screen: MuteTagsSettings,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.tagMuteSettings,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.MuteUsersSettings]: {
    screen: MuteUsersSettings,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.userMuteSettings,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.Feedback]: {
    screen: Feedback,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.feedback,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.PrivacyPolicy]: {
    screen: PrivacyPolicy,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.privacyPolicy,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
  [SCREENS.About]: {
    screen: About,
    options: ({ screenProps: { i18n, theme } }) => ({
      title: i18n.about,
      headerStyle: getThemedHeaderStyle(theme),
    }),
  },
};

export default config;

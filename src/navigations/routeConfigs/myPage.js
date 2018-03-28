import MyWorks from '../../screens/MyPage/MyWorks';
import MyConnection from '../../screens/MyPage/MyConnection/MyConnection';
import MyCollection from '../../screens/MyPage/MyCollection/MyCollection';
import BrowsingHistory from '../../screens/MyPage/BrowsingHistory/BrowsingHistory';
import Settings from '../../screens/MyPage/Settings';
import AccountSettings from '../../screens/MyPage/AccountSettings/AccountSettings';
import AdvanceAccountSettings from '../../screens/MyPage/AccountSettings/AdvanceAccountSettings';
import SaveImageSettings from '../../screens/MyPage/SaveImageSettings';
import HighlightTagsSettings from '../../screens/MyPage/HighlightTagsSettings';
import MuteTagsSettings from '../../screens/MyPage/MuteTagsSettings';
import MuteUsersSettings from '../../screens/MyPage/MuteUsersSettings';
import Language from '../../screens/MyPage/Language';
import Feedback from '../../screens/MyPage/Feedback';
import About from '../../screens/MyPage/About';
import { globalStyles } from '../../styles';
import { SCREENS } from '../../common/constants';

const config = {
  [SCREENS.MyConnection]: {
    screen: MyConnection,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.connection,
      headerStyle: globalStyles.headerWithoutShadow,
    }),
  },
  [SCREENS.MyCollection]: {
    screen: MyCollection,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.collection,
      headerStyle: globalStyles.headerWithoutShadow,
    }),
  },
  [SCREENS.MyWorks]: {
    screen: MyWorks,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.myWorks,
      headerStyle: globalStyles.headerWithoutShadow,
    }),
  },
  [SCREENS.BrowsingHistory]: {
    screen: BrowsingHistory,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.browsingHistory,
      headerStyle: globalStyles.headerWithoutShadow,
    }),
  },
  [SCREENS.Settings]: {
    screen: Settings,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.settings,
    }),
  },
  [SCREENS.AccountSettings]: {
    screen: AccountSettings,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.accountSettings,
    }),
  },
  [SCREENS.AdvanceAccountSettings]: {
    screen: AdvanceAccountSettings,
    navigationOptions: () => ({
      title: null,
    }),
  },
  [SCREENS.SaveImageSettings]: {
    screen: SaveImageSettings,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.saveImageSettings,
    }),
  },
  [SCREENS.HighlightTagsSettings]: {
    screen: HighlightTagsSettings,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.tagHighlightSettings,
    }),
  },
  [SCREENS.MuteTagsSettings]: {
    screen: MuteTagsSettings,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.tagMuteSettings,
    }),
  },
  [SCREENS.MuteUsersSettings]: {
    screen: MuteUsersSettings,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.userMuteSettings,
    }),
  },
  [SCREENS.Language]: {
    screen: Language,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.lang,
    }),
  },
  [SCREENS.Feedback]: {
    screen: Feedback,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.feedback,
    }),
  },
  [SCREENS.About]: {
    screen: About,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.about,
    }),
  },
};

export default config;

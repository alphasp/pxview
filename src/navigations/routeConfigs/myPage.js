import MyWorks from '../../screens/MyPage/MyWorks';
import MyConnection from '../../screens/MyPage/MyConnection/MyConnection';
import MyCollection from '../../screens/MyPage/MyCollection/MyCollection';
import BrowsingHistory from '../../screens/MyPage/BrowsingHistory';
import Settings from '../../screens/MyPage/Settings';
import AccountSettings from '../../screens/MyPage/AccountSettings';
import Language from '../../screens/MyPage/Language';
import Feedback from '../../screens/MyPage/Feedback';
import { globalStyleVariables } from '../../styles';

const headerWithShadowStyle = {
  shadowOpacity: 0,
  shadowOffset: {
    height: 0,
  },
  elevation: 0,
  backgroundColor: globalStyleVariables.HEADER_BACKGROUND_COLOR,
};

const config = {
  MyConnection: {
    screen: MyConnection,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.connection,
      headerStyle: headerWithShadowStyle,
    }),
  },
  MyCollection: {
    screen: MyCollection,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.collection,
      headerStyle: headerWithShadowStyle,
    }),
  },
  MyWorks: {
    screen: MyWorks,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.myWorks,
      headerStyle: headerWithShadowStyle,
    }),
  },
  BrowsingHistory: {
    screen: BrowsingHistory,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.browsingHistory,
    }),
  },
  Settings: {
    screen: Settings,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.settings,
    }),
  },
  AccountSettings: {
    screen: AccountSettings,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.accountSettings,
    }),
  },
  Language: {
    screen: Language,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.lang,
    }),
  },
  Feedback: {
    screen: Feedback,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.feedback,
    }),
  },
};

export default config;

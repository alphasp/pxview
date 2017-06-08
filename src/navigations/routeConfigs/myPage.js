import MyWorks from '../../screens/MyPage/MyWorks';
import MyConnection from '../../screens/MyPage/MyConnection/MyConnection';
import MyCollection from '../../screens/MyPage/MyCollection/MyCollection';
import BrowsingHistory from '../../screens/MyPage/BrowsingHistory';
import Settings from '../../screens/MyPage/Settings';
import AccountSettings from '../../screens/MyPage/AccountSettings';
import Language from '../../screens/MyPage/Language';

const config = {
  MyConnection: {
    screen: MyConnection,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.connection,
    }),
  },
  MyCollection: {
    screen: MyCollection,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.collection,
    }),
  },
  MyWorks: {
    screen: MyWorks,
    navigationOptions: ({ screenProps: { i18n } }) => ({
      title: i18n.myWorks,
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
};

export default config;

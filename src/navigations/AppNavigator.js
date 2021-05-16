import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
// import AppDrawerNavigator from './AppDrawerNavigator';
import AppTabNavigator from './AppTabNavigator';
import SearchFilterModal from '../screens/Shared/SearchFilterModal';
import SearchFilterPeriodDateModal from '../screens/Shared/SearchFilterPeriodDateModal';
import AddIllustComment from '../screens/Shared/AddIllustComment';
import AddNovelComment from '../screens/Shared/AddNovelComment';
import ReplyIllustComment from '../screens/Shared/ReplyIllustComment';
import ReplyNovelComment from '../screens/Shared/ReplyNovelComment';
import AccountSettings from '../screens/MyPage/AccountSettings/AccountSettings';
import Encyclopedia from '../screens/Shared/Encyclopedia';
import Detail from '../screens/Shared/Detail';
import NovelDetail from '../screens/Shared/NovelDetail';
import UserDetail from '../screens/Shared/UserDetail';
import IllustComments from '../screens/Shared/IllustComments';
import NovelComments from '../screens/Shared/NovelComments';
import NovelSeries from '../screens/Shared/NovelSeries';
import NovelReader from '../screens/Shared/NovelReader';
import UserIllusts from '../screens/Shared/UserIllusts';
import UserMangas from '../screens/Shared/UserMangas';
import UserNovels from '../screens/Shared/UserNovels';
import UserBookmarkIllusts from '../screens/Shared/UserBookmarkIllusts';
import UserBookmarkNovels from '../screens/Shared/UserBookmarkNovels';
import UserFollowing from '../screens/MyPage/MyConnection/UserFollowing';
import UserMyPixiv from '../screens/MyPage/MyConnection/UserMyPixiv';
import RelatedIllusts from '../screens/Shared/RelatedIllusts';
import SearchResultTabs from '../screens/Shared/SearchResultTabs';
import RecommendedUsers from '../screens/Shared/RecommendedUsers';
import ImagesViewer from '../screens/Shared/ImagesViewer';
import Ranking from '../screens/Ranking/Ranking';
import NovelRanking from '../screens/Ranking/NovelRanking';
import MyWorks from '../screens/MyPage/MyWorks';
import MyConnection from '../screens/MyPage/MyConnection/MyConnection';
import MyCollection from '../screens/MyPage/MyCollection/MyCollection';
import BrowsingHistory from '../screens/MyPage/BrowsingHistory/BrowsingHistory';
import Settings from '../screens/MyPage/Settings';
import AdvanceAccountSettings from '../screens/MyPage/AccountSettings/AdvanceAccountSettings';
import ReadingSettings from '../screens/MyPage/ReadingSettings';
import SaveImageSettings from '../screens/MyPage/SaveImageSettings';
import LikeButtonSettings from '../screens/MyPage/LikeButtonSettings';
import TrendingSearchSettings from '../screens/MyPage/TrendingSearchSettings';
import HighlightTagsSettings from '../screens/MyPage/HighlightTagsSettings';
import MuteSettings from '../screens/MyPage/MuteSettings/MuteSettings';
import MuteTagsSettings from '../screens/MyPage/MuteSettings/MuteTagsSettings';
import MuteUsersSettings from '../screens/MyPage/MuteSettings/MuteUsersSettings';
import Backup from '../screens/MyPage/Backup';
import Feedback from '../screens/MyPage/Feedback';
import PrivacyPolicy from '../screens/MyPage/PrivacyPolicy';
import About from '../screens/MyPage/About';
import { useLocalization } from '../components/Localization';
import {
  globalStyles,
  globalStyleVariables,
  getThemedHeaderStyle,
} from '../styles';
import { SCREENS } from '../common/constants';

const Stack = createNativeStackNavigator();

// todo screenProps by context
const AppNavigator = ({ initialRouteName }) => {
  const theme = useTheme();
  const { i18n } = useLocalization();
  const headerStyle = getThemedHeaderStyle(theme);
  const headerStyleWithoutShadow = {
    ...headerStyle,
    ...globalStyles.headerWithoutShadow,
  };
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.headerBackground }}>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
          headerBackTitle: null,
          headerTopInsetEnabled: false,
          stackAnimation: 'fade',
        }}
      >
        <Stack.Screen
          name={SCREENS.Main}
          // component={
          //   // config.navigation.tab
          //   //   ? createAppTabNavigator({ initialRouteName })
          //   //   : createAppDrawerNavigator({ initialRouteName })
          // }
          initialRouteName={initialRouteName}
          options={{
            headerShown: false,
          }}
        >
          {({ props }) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <AppTabNavigator {...props} initialRouteName={initialRouteName} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name={SCREENS.SearchFilterModal}
          component={SearchFilterModal}
          options={{
            title: i18n.searchDisplayOptions,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.SearchFilterPeriodDateModal}
          component={SearchFilterPeriodDateModal}
          options={{
            title: i18n.searchPeriodSpecifyDate,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.AddIllustComment}
          component={AddIllustComment}
          options={{
            title: i18n.commentAdd,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.AddNovelComment}
          component={AddNovelComment}
          options={{
            title: i18n.commentAdd,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.ReplyIllustComment}
          component={ReplyIllustComment}
          options={{
            title: i18n.commentAdd,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.ReplyNovelComment}
          component={ReplyNovelComment}
          options={{
            title: i18n.commentAdd,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.AccountSettingsModal}
          component={AccountSettings}
          options={{
            title: i18n.accountSettings,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.Encyclopedia}
          component={Encyclopedia}
          options={{
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.Detail}
          component={Detail}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={SCREENS.NovelDetail}
          component={NovelDetail}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={SCREENS.UserDetail}
          component={UserDetail}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={SCREENS.ImagesViewer}
          component={ImagesViewer}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={SCREENS.NovelReader}
          component={NovelReader}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={SCREENS.IllustComments}
          component={IllustComments}
          options={{
            title: i18n.comments,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.NovelComments}
          component={NovelComments}
          options={{
            title: i18n.comments,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.NovelSeries}
          component={NovelSeries}
          options={{
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.RelatedIllusts}
          component={RelatedIllusts}
          options={{
            title: i18n.relatedWorks,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.UserIllusts}
          component={UserIllusts}
          options={{
            title: i18n.userIllusts,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.UserMangas}
          component={UserMangas}
          options={{
            title: i18n.userMangas,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.UserNovels}
          component={UserNovels}
          options={{
            title: i18n.userNovels,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.UserBookmarkIllusts}
          component={UserBookmarkIllusts}
          options={{
            title: i18n.collection,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.UserBookmarkNovels}
          component={UserBookmarkNovels}
          options={{
            title: i18n.collection,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.UserFollowing}
          component={UserFollowing}
          options={{
            title: i18n.following,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.UserMyPixiv}
          component={UserMyPixiv}
          options={{
            title: i18n.myPixiv,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.SearchResult}
          component={SearchResultTabs}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={SCREENS.RecommendedUsers}
          component={RecommendedUsers}
          options={{
            title: i18n.recommendedUsers,
            headerStyle,
          }}
        />
        {/* my page route */}
        <Stack.Screen
          name={SCREENS.MyConnection}
          component={MyConnection}
          options={{
            title: i18n.connection,
            headerStyle: headerStyleWithoutShadow,
          }}
        />
        <Stack.Screen
          name={SCREENS.MyCollection}
          component={MyCollection}
          options={{
            title: i18n.collection,
            headerStyle: headerStyleWithoutShadow,
          }}
        />
        <Stack.Screen
          name={SCREENS.MyWorks}
          component={MyWorks}
          options={{
            title: i18n.myWorks,
            headerStyle: headerStyleWithoutShadow,
          }}
        />
        <Stack.Screen
          name={SCREENS.BrowsingHistory}
          component={BrowsingHistory}
          options={{
            title: i18n.browsingHistory,
            headerStyle: headerStyleWithoutShadow,
          }}
        />
        <Stack.Screen
          name={SCREENS.Settings}
          component={Settings}
          options={{
            title: i18n.settings,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.AccountSettings}
          component={AccountSettings}
          options={{
            title: i18n.accountSettings,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.AdvanceAccountSettings}
          component={AdvanceAccountSettings}
          options={{
            title: null,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.ReadingSettings}
          component={ReadingSettings}
          options={{
            title: i18n.readingSettings,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.SaveImageSettings}
          component={SaveImageSettings}
          options={{
            title: i18n.saveImageSettings,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.LikeButtonSettings}
          component={LikeButtonSettings}
          options={{
            title: i18n.likeButtonSettings,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.TrendingSearchSettings}
          component={TrendingSearchSettings}
          options={{
            title: i18n.trendingSearchSettings,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.HighlightTagsSettings}
          component={HighlightTagsSettings}
          options={{
            title: i18n.tagHighlightSettings,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.MuteSettings}
          component={MuteSettings}
          options={{
            title: i18n.muteSettings,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.MuteTagsSettings}
          component={MuteTagsSettings}
          options={{
            title: i18n.tagMuteSettings,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.MuteUsersSettings}
          component={MuteUsersSettings}
          options={{
            title: i18n.userMuteSettings,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.Backup}
          component={Backup}
          options={{
            title: i18n.backup,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.Feedback}
          component={Feedback}
          options={{
            title: i18n.feedback,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.PrivacyPolicy}
          component={PrivacyPolicy}
          options={{
            title: i18n.privacyPolicy,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.About}
          component={About}
          options={{
            title: i18n.about,
            headerStyle,
          }}
        />
        <Stack.Screen
          name={SCREENS.NovelRanking}
          component={NovelRanking}
          options={{
            headerStyle: getThemedHeaderStyle(theme),
            headerStatusBarHeight: 0,
          }}
        />
        <Stack.Screen
          name={SCREENS.Ranking}
          component={Ranking}
          options={{
            headerStyle: getThemedHeaderStyle(theme),
            headerStatusBarHeight: 0,
          }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default AppNavigator;

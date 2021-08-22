import React from 'react';
import { useTheme } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import RankingPreview from '../screens/Ranking/RankingPreview';
import Ranking from '../screens/Ranking/Ranking';
import NovelRanking from '../screens/Ranking/NovelRanking';
import { useLocalization } from '../components/Localization';
import DrawerMenuButton from '../components/DrawerMenuButton';
import {
  globalStyles,
  globalStyleVariables,
  getThemedHeaderStyle,
} from '../styles';
import config from '../common/config';
import { SCREENS } from '../common/constants';

const Stack = createNativeStackNavigator();

const RankingNavigator = () => {
  const theme = useTheme();
  const { i18n } = useLocalization();
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: config.navigation.tab
          ? globalStyles.header
          : globalStyles.headerWithoutShadow,
        headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
        headerBackTitle: null,
        animation: 'none',
      }}
      // cardStyle={globalStyles.card}
      // headerMode="screen"
    >
      <Stack.Screen
        name={SCREENS.RankingPreview}
        component={RankingPreview}
        options={{
          title: i18n.ranking,
          headerStyle: getThemedHeaderStyle(theme),
          headerLeft: () => (
            <DrawerMenuButton onPress={() => navigation.openDrawer()} />
          ),
          headerStatusBarHeight: 0,
        }}
      />
      {/* <Stack.Screen
        name={SCREENS.Ranking}
        component={Ranking}
        options={{
          headerStyle: getThemedHeaderStyle(theme),
          headerStatusBarHeight: 0,
        }}
      /> */}
      {/* <Stack.Screen
        name={SCREENS.NovelRanking}
        component={NovelRanking}
        options={{
          headerStyle: getThemedHeaderStyle(theme),
          headerStatusBarHeight: 0,
        }}
      /> */}
    </Stack.Navigator>
  );
};

export default RankingNavigator;

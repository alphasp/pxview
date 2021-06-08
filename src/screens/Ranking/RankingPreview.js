import React, { useState, useRef } from 'react';
import { ScrollView, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import RankingHorizontalList from './RankingHorizontalList';
import NovelRankingPreview from './NovelRankingPreview';
import { RANKING_TYPES, RANKING_FOR_UI } from '../../common/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const RankingPreview = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [refreshing, toggleRefreshing] = useState(false);
  const ref = useRef(null);
  useScrollToTop(ref);

  const renderHeader = () => {
    return (
      <>
        <RankingHorizontalList
          rankingMode={RANKING_FOR_UI.DAILY_ILLUST}
          rankingType={RANKING_TYPES.ILLUST}
          navigation={navigation}
          refreshing={refreshing}
          theme={theme}
          onRefreshSuccess={() => toggleRefreshing(false)}
        />
        <RankingHorizontalList
          rankingMode={RANKING_FOR_UI.DAILY_MANGA}
          rankingType={RANKING_TYPES.MANGA}
          navigation={navigation}
          refreshing={refreshing}
          theme={theme}
        />
      </>
    );
  };
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        ref={ref}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={
          <NovelRankingPreview
            rankingMode={RANKING_FOR_UI.DAILY_NOVEL}
            navigation={navigation}
            refreshing={refreshing}
            theme={theme}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => toggleRefreshing(true)}
          />
        }
      />
    </SafeAreaView>
  );
};

export default RankingPreview;

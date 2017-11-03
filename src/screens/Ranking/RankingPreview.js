import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import RankingHorizontalList from './RankingHorizontalList';
import { connectLocalization } from '../../components/Localization';
import { RANKING_TYPES, RANKING_FOR_UI } from '../../common/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
});

class RankingPreview extends Component {
  render() {
    const { navigation } = this.props;
    return (
      <ScrollView style={styles.container}>
        <RankingHorizontalList
          rankingMode={RANKING_FOR_UI.DAILY_ILLUST}
          rankingType={RANKING_TYPES.ILLUST}
          navigation={navigation}
        />
        <RankingHorizontalList
          rankingMode={RANKING_FOR_UI.DAILY_MANGA}
          rankingType={RANKING_TYPES.MANGA}
          navigation={navigation}
        />
      </ScrollView>
    );
  }
}

export default connectLocalization(RankingPreview);

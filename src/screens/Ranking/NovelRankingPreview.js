import React, { Component } from 'react';
import { View, Text, InteractionManager, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connectLocalization } from '../../components/Localization';
import NovelList from '../../components/NovelList';
import PXTouchable from '../../components/PXTouchable';
import ViewMoreButton from '../../components/ViewMoreButton';
import * as rankingActionCreators from '../../common/actions/ranking';
import { makeGetNovelRankingItems } from '../../common/selectors';
import { SCREENS, RANKING_TYPES } from '../../common/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
  },
  viewMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevronIcon: {
    marginLeft: 5,
  },
  bottomViewMoreButtonContainer: {
    marginTop: 10,
  },
});

class NovelRankingPreview extends Component {
  componentDidMount() {
    const { rankingMode, options, fetchRanking, clearRanking } = this.props;
    InteractionManager.runAfterInteractions(() => {
      clearRanking(rankingMode);
      fetchRanking(rankingMode, options);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { refreshing: prevRefreshing } = this.props;
    const { refreshing, onRefreshSuccess } = nextProps;
    if (refreshing && refreshing !== prevRefreshing) {
      this.handleOnRefresh();
      if (onRefreshSuccess) {
        onRefreshSuccess();
      }
    }
  }

  handleOnRefresh = () => {
    const { rankingMode, fetchRanking, clearRanking } = this.props;
    clearRanking(rankingMode);
    fetchRanking(rankingMode, null, null, true);
  };

  handleOnPressViewMore = () => {
    const { navigation: { navigate } } = this.props;
    navigate(SCREENS.NovelRanking, {
      rankingType: RANKING_TYPES.NOVEL,
    });
  };

  render() {
    const { ranking, items, i18n } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {i18n.novel}
          </Text>
          <PXTouchable
            style={styles.viewMoreContainer}
            onPress={this.handleOnPressViewMore}
          >
            <Text>
              {i18n.viewMore}
            </Text>
            <Icon name="chevron-right" style={styles.chevronIcon} />
          </PXTouchable>
        </View>
        <NovelList
          data={{ ...ranking, items }}
          onRefresh={this.handleOnRefresh}
          maxItems={10}
        />
        <View style={styles.bottomViewMoreButtonContainer}>
          <ViewMoreButton onPress={this.handleOnPressViewMore} />
        </View>
      </View>
    );
  }
}

export default connectLocalization(
  connect(() => {
    const getRankingItems = makeGetNovelRankingItems();
    return (state, props) => {
      const { ranking } = state;
      return {
        ranking: ranking[props.rankingMode],
        items: getRankingItems(state, props),
      };
    };
  }, rankingActionCreators)(NovelRankingPreview),
);

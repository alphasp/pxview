import React, { Component } from 'react';
import { View, InteractionManager, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import { withTheme, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import IllustItem from '../../components/IllustItem';
import PXTouchable from '../../components/PXTouchable';
import Loader from '../../components/Loader';
import { connectLocalization } from '../../components/Localization';
import * as rankingActionCreators from '../../common/actions/ranking';
import { makeGetIllustRankingItems } from '../../common/selectors';
import { SCREENS, RANKING_TYPES } from '../../common/constants';
import { globalStyleVariables } from '../../styles';

const SLIDER_WIDTH = globalStyleVariables.WINDOW_WIDTH;
const ITEM_HORIZONTAL_PADDING = 5;
const ITEM_WIDTH =
  globalStyleVariables.WINDOW_WIDTH / 3 + ITEM_HORIZONTAL_PADDING * 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'contain',
  },
  sliderContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    paddingHorizontal: ITEM_HORIZONTAL_PADDING,
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
});

class RankingHorizontalList extends Component {
  componentDidMount() {
    const { rankingMode, options, fetchRanking, clearRanking } = this.props;
    InteractionManager.runAfterInteractions(() => {
      clearRanking(rankingMode);
      fetchRanking(rankingMode, options);
    });
  }

  componentDidUpdate(prevProps) {
    const { refreshing, onRefreshSuccess } = this.props;
    const { refreshing: prevRefreshing } = prevProps;
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
    const {
      navigation: { navigate },
      rankingType,
    } = this.props;
    navigate(SCREENS.Ranking, {
      rankingType,
    });
  };

  handleOnPressItem = (item) => {
    const {
      items,
      navigation: { push },
    } = this.props;
    const index = items.findIndex((i) => i.id === item.id);
    push(SCREENS.Detail, {
      items,
      index,
    });
  };

  mapRankingTypeString = (rankingType) => {
    const { i18n } = this.props;
    switch (rankingType) {
      case RANKING_TYPES.ILLUST:
        return i18n.illustration;
      case RANKING_TYPES.MANGA:
        return i18n.manga;
      default:
        return '';
    }
  };

  renderItem = ({ item, index }) => (
    <View style={styles.sliderContainer}>
      <IllustItem
        key={item.id}
        illustId={item.id}
        index={index}
        numColumns={3}
        onPressItem={() => this.handleOnPressItem(item)}
      />
    </View>
  );

  render() {
    const {
      ranking: { loading, loaded },
      items,
      rankingType,
      i18n,
      theme,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {this.mapRankingTypeString(rankingType)}
          </Text>
          <PXTouchable
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            style={styles.viewMoreContainer}
            onPress={this.handleOnPressViewMore}
          >
            <Text>{i18n.viewMore}</Text>
            <Icon
              name="chevron-right"
              style={styles.chevronIcon}
              color={theme.colors.text}
            />
          </PXTouchable>
        </View>
        {loading && <Loader />}
        {loaded && (
          <Carousel
            ref={(ref) => {
              this.carousel = ref;
            }}
            data={items}
            renderItem={this.renderItem}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            activeSlideAlignment="start"
            enableMomentum
            decelerationRate={0.9}
            enableSnap={false}
          />
        )}
      </View>
    );
  }
}

export default withTheme(
  connectLocalization(
    connect(() => {
      const getRankingItems = makeGetIllustRankingItems();
      return (state, props) => {
        const { ranking } = state;
        return {
          ranking: ranking[props.rankingMode],
          items: getRankingItems(state, props),
        };
      };
    }, rankingActionCreators)(RankingHorizontalList),
  ),
);

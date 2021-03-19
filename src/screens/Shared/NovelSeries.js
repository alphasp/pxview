import React, { Component } from 'react';
import { View, StyleSheet, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { connectLocalization } from '../../components/Localization';
import NovelList from '../../components/NovelList';
import NovelItem from '../../components/NovelItem';
import ViewMoreButton from '../../components/ViewMoreButton';
import Loader from '../../components/Loader';
import * as novelSeriesActionCreators from '../../common/actions/novelSeries';
import { makeGetNovelSeriesItems } from '../../common/selectors';
import { globalStyles } from '../../styles';
import { SCREENS } from '../../common/constants';

const styles = StyleSheet.create({
  viewMoreButtonContainer: {
    margin: 10,
  },
  listContainer: {
    flex: 1,
  },
});

class NovelSeries extends Component {
  componentDidMount() {
    const {
      novelSeries,
      seriesId,
      fetchNovelSeries,
      clearNovelSeries,
      navigation,
      route,
    } = this.props;
    const { seriesTitle } = route.params;
    // will render blank unless scrolled
    // https://github.com/facebook/react-native/issues/10142
    if (!novelSeries || !novelSeries.items) {
      clearNovelSeries(seriesId);
      InteractionManager.runAfterInteractions(() => {
        fetchNovelSeries(seriesId);
      });
    }
    navigation.setOptions({
      title: seriesTitle,
    });
  }

  loadMoreItems = () => {
    const { novelSeries, seriesId, fetchNovelSeries } = this.props;
    if (novelSeries && !novelSeries.loading && novelSeries.nextUrl) {
      fetchNovelSeries(seriesId, null, novelSeries.nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { seriesId, fetchNovelSeries, clearNovelSeries } = this.props;
    clearNovelSeries(seriesId);
    fetchNovelSeries(seriesId, null, null, true);
  };

  handleOnPressViewMoreNovelSeries = () => {
    const {
      seriesId,
      seriesTitle,
      navigation: { push },
    } = this.props;
    push(SCREENS.NovelSeries, {
      seriesId,
      seriesTitle,
    });
  };

  handleOnPressItem = (item, index) => {
    const {
      items,
      navigation: { push },
      listKey,
      maxItems,
    } = this.props;
    push(SCREENS.NovelDetail, {
      items: maxItems ? items.slice(0, maxItems) : items,
      index,
      parentListKey: listKey,
    });
  };

  renderList = () => {
    const {
      novelSeries,
      items,
      maxItems,
      isFeatureInDetailPage,
      listKey,
      isDetailPageReady,
    } = this.props;
    if (isFeatureInDetailPage) {
      if (!isDetailPageReady) {
        return <Loader />;
      }
      if (novelSeries?.loaded && items?.length) {
        return (
          <View style={styles.listContainer}>
            {items.slice(0, maxItems).map((item, index) => {
              return (
                <NovelItem
                  key={item.id}
                  novelId={item.id}
                  index={index}
                  onPressItem={() => this.handleOnPressItem(item, index)}
                />
              );
            })}
          </View>
        );
      }
      return null;
    }
    return (
      <NovelList
        data={{ ...novelSeries, items }}
        listKey={listKey}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  };

  render() {
    const {
      novelSeries,
      items,
      isFeatureInDetailPage,
      maxItems,
      isDetailPageReady,
    } = this.props;
    return (
      <View style={globalStyles.container}>
        {this.renderList()}
        {isFeatureInDetailPage &&
        isDetailPageReady &&
        novelSeries?.loaded &&
        items?.length &&
        items?.length > maxItems ? (
          <View style={styles.viewMoreButtonContainer}>
            <ViewMoreButton onPress={this.handleOnPressViewMoreNovelSeries} />
          </View>
        ) : null}
      </View>
    );
  }
}

export default connectLocalization(
  connect(() => {
    const getNovelSeriesItems = makeGetNovelSeriesItems();
    return (state, props) => {
      const { novelSeries } = state;
      const { isFeatureInDetailPage } = props;
      const seriesId = props.seriesId || props.route.params.seriesId;
      return {
        novelSeries: novelSeries[seriesId],
        items: getNovelSeriesItems(state, props),
        seriesId,
        listKey: !isFeatureInDetailPage
          ? `${props.route.key}-${seriesId}-NovelSeries`
          : null,
      };
    };
  }, novelSeriesActionCreators)(NovelSeries),
);

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  RefreshControl,
  FlatList,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import IllustItem from './IllustItem';
import Loader from './Loader';
import * as bookmarkIllustActionCreators from '../common/actions/bookmarkIllust';
import { globalStyles, globalStyleVariables } from '../styles';
import { SCREENS } from '../common/constants';

const ILLUST_COLUMNS = 3;

const styles = StyleSheet.create({
  footer: {
    marginBottom: 20,
  },
});

class IllustList extends Component {
  renderItem = ({ item, index }) =>
    <IllustItem
      key={item.id}
      item={item}
      index={index}
      numColumns={ILLUST_COLUMNS}
      onPressItem={() => this.handleOnPressItem(item)}
    />;

  renderFooter = () => {
    const { data: { nextUrl, loading } } = this.props;
    return nextUrl && loading
      ? <View style={styles.footer}>
          <Loader />
        </View>
      : null;
  };

  handleOnPressItem = item => {
    const { navigate } = this.props.navigation;
    navigate(SCREENS.Detail, { item });
  };

  handleOnLayout = e => {
    const { onListLayout } = this.props;
    if (onListLayout) {
      onListLayout(e, this.illustList);
    }
  };

  render() {
    const {
      data: { items, loading, loaded, refreshing },
      onRefresh,
      loadMoreItems,
      onScroll,
      maxItems,
    } = this.props;
    return (
      <View style={globalStyles.container}>
        {(!items || (!loaded && loading)) && <Loader />}
        {loaded
          ? <FlatList
              onLayout={this.handleOnLayout}
              ref={ref => (this.illustList = ref)}
              data={
                maxItems && (items && items.length)
                  ? items.slice(0, maxItems)
                  : items
              }
              numColumns={ILLUST_COLUMNS}
              keyExtractor={item => item.id}
              renderItem={this.renderItem}
              getItemLayout={(data, index) => ({
                length: globalStyleVariables.WINDOW_WIDTH / ILLUST_COLUMNS,
                offset:
                  globalStyleVariables.WINDOW_WIDTH / ILLUST_COLUMNS * index,
                index,
              })}
              removeClippedSubviews={Platform.OS === 'android'}
              initialNumToRender={5}
              onEndReachedThreshold={0.1}
              onEndReached={loadMoreItems}
              ListFooterComponent={this.renderFooter}
              onScroll={onScroll}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          : null}
      </View>
    );
  }
}

export default withNavigation(
  connect(null, bookmarkIllustActionCreators)(IllustList),
);

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  RefreshControl,
  FlatList,
  Platform,
  DeviceEventEmitter,
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { withTheme } from 'react-native-paper';
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
  componentDidUpdate(prevProps) {
    const { data: { items: prevItems } } = prevProps;
    const { data: { items }, listKey, maxItems } = this.props;
    if (listKey && (items && items.length) && items !== prevItems) {
      DeviceEventEmitter.emit('masterListUpdate', {
        listKey,
        items: maxItems ? items.slice(0, maxItems) : items,
      });
    }
  }

  renderItem = ({ item, index }) =>
    <IllustItem
      key={item.id}
      illustId={item.id}
      index={index}
      numColumns={ILLUST_COLUMNS}
      onPressItem={() => this.handleOnPressItem(item, index)}
    />;

  renderFooter = () => {
    const { data: { nextUrl, loading } } = this.props;
    return nextUrl && loading
      ? <View style={styles.footer}>
          <Loader />
        </View>
      : null;
  };

  handleOnPressItem = (item, index) => {
    const {
      data: { items },
      navigation: { push },
      loadMoreItems,
      listKey,
      maxItems,
    } = this.props;
    push(SCREENS.Detail, {
      items: maxItems ? items.slice(0, maxItems) : items,
      index,
      onListEndReached: loadMoreItems,
      parentListKey: listKey,
    });
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
      listKey,
      onRefresh,
      renderEmpty,
      renderHeader,
      loadMoreItems,
      onScroll,
      onEndReachedThreshold,
      showsVerticalScrollIndicator,
      maxItems,
      theme,
    } = this.props;
    return (
      <View
        style={[
          globalStyles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        {!loaded && renderHeader && renderHeader()}
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
              keyExtractor={item => item.id.toString()}
              listKey={listKey}
              renderItem={this.renderItem}
              getItemLayout={(data, index) => ({
                length: globalStyleVariables.WINDOW_WIDTH / ILLUST_COLUMNS,
                offset:
                  globalStyleVariables.WINDOW_WIDTH / ILLUST_COLUMNS * index,
                index,
              })}
              removeClippedSubviews={Platform.OS === 'android'}
              initialNumToRender={5}
              onEndReachedThreshold={onEndReachedThreshold || 0.1}
              onEndReached={loadMoreItems}
              ListEmptyComponent={renderEmpty}
              ListHeaderComponent={renderHeader}
              ListFooterComponent={this.renderFooter}
              onScroll={onScroll}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              showsVerticalScrollIndicator={
                showsVerticalScrollIndicator !== null
                  ? showsVerticalScrollIndicator
                  : true
              }
            />
          : null}
      </View>
    );
  }
}

export default withTheme(
  withNavigation(connect(null, bookmarkIllustActionCreators)(IllustList)),
);

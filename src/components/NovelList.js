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
import NovelItem from './NovelItem';
import Loader from './Loader';
import * as bookmarkIllustActionCreators from '../common/actions/bookmarkIllust';
import { globalStyles } from '../styles';
import { SCREENS } from '../common/constants';

const styles = StyleSheet.create({
  footer: {
    marginBottom: 20,
  },
  separator: {
    backgroundColor: '#000',
    // width: '100%',
    height: StyleSheet.hairlineWidth,
  },
});

class NovelList extends Component {
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
    <NovelItem
      key={item.id}
      novelId={item.id}
      index={index}
      onPressItem={() => this.handleOnPressItem(item, index)}
    />;

  renderSeparator = () => <View style={styles.separator} />;

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
      navigation: { navigate },
      loadMoreItems,
      listKey,
      maxItems,
    } = this.props;
    navigate(SCREENS.NovelDetail, {
      items: maxItems ? items.slice(0, maxItems) : items,
      index,
      onListEndReached: loadMoreItems,
      parentListKey: listKey,
    });
  };

  handleOnLayout = e => {
    const { onListLayout } = this.props;
    if (onListLayout) {
      onListLayout(e, this.novelList);
    }
  };

  render() {
    const {
      data: { items, loading, loaded, refreshing },
      onRefresh,
      renderEmpty,
      renderHeader,
      loadMoreItems,
      onScroll,
      showsVerticalScrollIndicator,
      maxItems,
    } = this.props;
    return (
      <View style={globalStyles.container}>
        {!loaded && renderHeader && renderHeader()}
        {(!items || (!loaded && loading)) && <Loader />}
        {loaded
          ? <FlatList
              onLayout={this.handleOnLayout}
              ref={ref => (this.novelList = ref)}
              data={
                maxItems && (items && items.length)
                  ? items.slice(0, maxItems)
                  : items
              }
              keyExtractor={item => item.id.toString()}
              renderItem={this.renderItem}
              removeClippedSubviews={Platform.OS === 'android'}
              initialNumToRender={5}
              onEndReachedThreshold={0.1}
              onEndReached={loadMoreItems}
              ItemSeparatorComponent={this.renderSeparator}
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

export default withNavigation(
  connect(null, bookmarkIllustActionCreators)(NovelList),
);

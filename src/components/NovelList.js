import React, { Component, forwardRef } from 'react';
import {
  StyleSheet,
  View,
  RefreshControl,
  FlatList,
  Platform,
  DeviceEventEmitter,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, Divider } from 'react-native-paper';
import NovelItem from './NovelItem';
import Loader from './Loader';
import { globalStyles } from '../styles';
import { SCREENS } from '../common/constants';

const styles = StyleSheet.create({
  footer: {
    marginBottom: 20,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

class NovelList extends Component {
  componentDidMount() {
    const { listKey, loadMoreItems } = this.props;
    if (listKey && loadMoreItems) {
      this.onNovelDetailListEndReachedListener = DeviceEventEmitter.addListener(
        `onNovelDetailListEndReached`,
        this.handleOnNovelDetailListEndReached,
      );
    }
  }

  componentDidUpdate(prevProps) {
    const {
      data: { items: prevItems },
    } = prevProps;
    const {
      data: { items },
      listKey,
      maxItems,
    } = this.props;
    if (listKey && items && items.length && items !== prevItems) {
      DeviceEventEmitter.emit('masterListUpdate', {
        listKey,
        items: maxItems ? items.slice(0, maxItems) : items,
      });
    }
  }

  componentWillUnmount() {
    if (this.onNovelDetailListEndReachedListener) {
      this.onNovelDetailListEndReachedListener.remove();
    }
  }

  handleOnNovelDetailListEndReached = ({ parentListKey }) => {
    const { loadMoreItems, listKey } = this.props;
    if (loadMoreItems && listKey === parentListKey) {
      loadMoreItems();
    }
  };

  renderItem = ({ item, index }) => (
    <NovelItem
      key={item.id}
      novelId={item.id}
      index={index}
      onPressItem={() => this.handleOnPressItem(item, index)}
    />
  );

  renderFooter = () => {
    const {
      data: { nextUrl, loading },
    } = this.props;
    return nextUrl && loading ? (
      <View style={styles.footer}>
        <Loader />
      </View>
    ) : null;
  };

  handleOnPressItem = (item, index) => {
    const {
      data: { items },
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

  handleOnLayout = (e) => {
    const { onListLayout } = this.props;
    if (onListLayout) {
      onListLayout(e, this.novelList);
    }
  };

  renderSeparator = () => <Divider />;

  render() {
    const {
      data: { items, loading, loaded, refreshing },
      onRefresh,
      renderEmpty,
      renderHeader,
      loadMoreItems,
      onScroll,
      onEndReachedThreshold,
      showsVerticalScrollIndicator,
      maxItems,
      theme,
      innerRef,
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
        {loaded ? (
          <FlatList
            onLayout={this.handleOnLayout}
            ref={(ref) => {
              this.novelList = ref;
              if (innerRef) {
                innerRef.current = ref;
              }
            }}
            data={
              maxItems && items && items.length
                ? items.slice(0, maxItems)
                : items
            }
            keyExtractor={(item) => item.id.toString()}
            renderItem={this.renderItem}
            removeClippedSubviews={Platform.OS === 'android'}
            initialNumToRender={5}
            onEndReachedThreshold={onEndReachedThreshold || 0.1}
            onEndReached={loadMoreItems}
            contentContainerStyle={styles.contentContainer}
            ListEmptyComponent={renderEmpty}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={this.renderFooter}
            ItemSeparatorComponent={this.renderSeparator}
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
        ) : null}
      </View>
    );
  }
}

export default forwardRef((props, ref) => {
  const theme = useTheme();
  const navigation = useNavigation();
  return (
    <NovelList
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      theme={theme}
      navigation={navigation}
      innerRef={ref}
    />
  );
});

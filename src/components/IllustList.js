import React, { Component, forwardRef } from 'react';
import {
  StyleSheet,
  View,
  RefreshControl,
  FlatList,
  Platform,
  DeviceEventEmitter,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTheme, Button } from 'react-native-paper';
import IllustItem from './IllustItem';
import Loader from './Loader';
import EmptyStateView from './EmptyStateView';
import { globalStyles, globalStyleVariables } from '../styles';
import { SCREENS } from '../common/constants';

const ILLUST_COLUMNS = 3;

const styles = StyleSheet.create({
  footer: {
    marginBottom: 20,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

class IllustList extends Component {
  componentDidMount() {
    const { listKey, loadMoreItems } = this.props;
    if (listKey && loadMoreItems) {
      this.onDetailListEndReachedListener = DeviceEventEmitter.addListener(
        `onDetailListEndReached`,
        this.handleOnDetailListEndReached,
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
    if (this.onDetailListEndReachedListener) {
      this.onDetailListEndReachedListener.remove();
    }
  }

  handleOnDetailListEndReached = ({ parentListKey }) => {
    const { loadMoreItems, listKey } = this.props;
    if (loadMoreItems && listKey === parentListKey) {
      loadMoreItems();
    }
  };

  renderItem = ({ item, index }) => {
    const { hideBookmarkButton } = this.props;
    return (
      <IllustItem
        key={item.id}
        illustId={item.id}
        index={index}
        numColumns={ILLUST_COLUMNS}
        hideBookmarkButton={hideBookmarkButton}
        onPressItem={() => this.handleOnPressItem(item, index)}
      />
    );
  };

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
    push(SCREENS.Detail, {
      items: maxItems ? items.slice(0, maxItems) : items,
      index,
      parentListKey: listKey,
    });
  };

  handleOnLayout = (e) => {
    const { onListLayout } = this.props;
    if (onListLayout) {
      onListLayout(e, this.illustList);
    }
  };

  renderEmpty = () => {
    const { renderEmpty } = this.props;
    // if (!isConnected) {
    //   // todo
    //   return (
    //     <EmptyStateView
    //       iconName="users"
    //       iconType="font-awesome"
    //       title="title here"
    //       description="some description"
    //       actionButton={
    //         <Button mode="contained" onPress={onRefresh}>
    //           Reload
    //         </Button>
    //       }
    //     />
    //   );
    // }
    if (renderEmpty) {
      return renderEmpty();
    }
    return null;
  };

  render() {
    const {
      data: { items, loading, loaded, refreshing },
      listKey,
      onRefresh,
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
              this.illustList = ref;
              if (innerRef) {
                innerRef.current = ref;
              }
            }}
            data={
              maxItems && items && items.length
                ? items.slice(0, maxItems)
                : items
            }
            numColumns={ILLUST_COLUMNS}
            keyExtractor={(item) => item.id.toString()}
            listKey={listKey}
            renderItem={this.renderItem}
            getItemLayout={(data, index) => ({
              length: globalStyleVariables.WINDOW_WIDTH / ILLUST_COLUMNS,
              offset:
                (globalStyleVariables.WINDOW_WIDTH / ILLUST_COLUMNS) * index,
              index,
            })}
            removeClippedSubviews={Platform.OS === 'android'}
            initialNumToRender={5}
            onEndReachedThreshold={onEndReachedThreshold || 0.1}
            onEndReached={loadMoreItems}
            contentContainerStyle={styles.contentContainer}
            ListEmptyComponent={this.renderEmpty}
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
        ) : null}
      </View>
    );
  }
}

export default forwardRef((props, ref) => {
  const theme = useTheme();
  const navigation = useNavigation();
  // const isConnected = useSelector((state) => state.network.isConnected);
  return (
    <IllustList
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      // isConnected={isConnected}
      theme={theme}
      navigation={navigation}
      innerRef={ref}
    />
  );
});

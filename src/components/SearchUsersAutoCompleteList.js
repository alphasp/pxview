import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Keyboard,
  RefreshControl,
} from 'react-native';
import { Text } from 'react-native-paper';
import { connectLocalization } from './Localization';
import PXTouchable from './PXTouchable';
import PXThumbnailTouchable from './PXThumbnailTouchable';
import FollowButtonContainer from '../containers/FollowButtonContainer';
import Loader from './Loader';
import Separator from './Separator';
import { globalStyles } from '../styles';

const styles = StyleSheet.create({
  row: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  thumnailNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    marginLeft: 5,
  },
  footer: {
    marginBottom: 20,
  },
  searchUserAutoCompleteHeaderContainer: {
    padding: 10,
  },
  searchUserAutoCompleteTitle: {
    fontWeight: 'bold',
  },
});

class SearchUsersAutoCompleteList extends PureComponent {
  renderItem = ({ item }) => {
    const { onPressItem } = this.props;
    return (
      <PXTouchable onPress={() => onPressItem(item.user.id)}>
        <View style={styles.row}>
          <View style={styles.thumnailNameContainer}>
            <PXThumbnailTouchable
              uri={item.user.profile_image_urls.medium}
              onPress={() => onPressItem(item.user.id)}
            />
            <Text style={styles.username}>{item.user.name}</Text>
          </View>
          <FollowButtonContainer userId={item.user.id} />
        </View>
      </PXTouchable>
    );
  };

  renderSeparator = (sectionId, rowId) => (
    <Separator key={`${sectionId}-${rowId}`} />
  );

  renderFooter = () => {
    const {
      data: { nextUrl },
    } = this.props;
    return nextUrl ? (
      <View style={styles.footer}>
        <Loader />
      </View>
    ) : null;
  };

  render() {
    const {
      data: { items, loading, loaded, refreshing },
      onRefresh,
      loadMoreItems,
      i18n,
    } = this.props;
    return (
      <View style={globalStyles.container}>
        <View style={styles.searchUserAutoCompleteHeaderContainer}>
          <Text style={styles.searchUserAutoCompleteTitle}>
            {i18n.searchSuggest}
          </Text>
        </View>
        {!loaded && loading && <Loader />}
        {items && items.length ? (
          <FlatList
            data={items}
            keyExtractor={(item) => item.user.id.toString()}
            renderItem={this.renderItem}
            ItemSeparatorComponent={Separator}
            keyboardShouldPersistTaps="always"
            onEndReachedThreshold={0.1}
            onEndReached={loadMoreItems}
            ListFooterComponent={this.renderFooter}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            removeClippedSubviews={false} // to prevent flatlist hidden after switch language
            onScroll={Keyboard.dismiss}
          />
        ) : null}
      </View>
    );
  }
}

export default connectLocalization(SearchUsersAutoCompleteList);

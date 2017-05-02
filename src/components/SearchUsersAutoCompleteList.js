import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  Animated,
  FlatList,
  Keyboard,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PXTouchable from './PXTouchable';
import PXThumbnailTouchable from './PXThumbnailTouchable';
import FollowButton from './FollowButton';
import Loader from './Loader';
import Separator from './Separator';
import SearchHistory from './SearchHistory';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
});

class SearchUsersAutoCompleteList extends PureComponent {
  renderItem = ({ item }) => {
    const { onPressItem } = this.props;
    return (
      <PXTouchable
        key={item.user.id}
        onPress={() => onPressItem(item.user.id)}
      >
        <View style={styles.row}>
          <View style={styles.thumnailNameContainer}>
            <PXThumbnailTouchable
              uri={item.user.profile_image_urls.medium}
              onPress={() => onPressItem(item.user.id)}
            />
            <Text style={styles.username}>{item.user.name}</Text>
          </View>
          <FollowButton isFollow={item.user.is_followed} />
        </View>
      </PXTouchable>
    );
  }

  renderSeparator = (sectionId, rowId) => (
    <Separator key={`${sectionId}-${rowId}`} />
    )

  renderFooter = () => {
    const { data: { items, nextUrl } } = this.props;
    return (
      nextUrl ?
        <View style={{ marginBottom: 20 }}>
          <Loader />
        </View>
      :
      null
    );
  }

  render() {
    const { data: { items, loading, loaded, refreshing }, onRefresh, loadMoreItems } = this.props;
    return (
      <View style={styles.container}>
        {
          !loaded && loading &&
          <Loader />
        }
        {
          (items && items.length) ?
            <FlatList
              data={items}
              keyExtractor={(item, index) => item.user.id}
              renderItem={this.renderItem}
              ItemSeparatorComponent={Separator}
              keyboardShouldPersistTaps="always"
              onEndReachedThreshold={0.1}
              onEndReached={loadMoreItems}
              ListFooterComponent={this.renderFooter}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
            }
              onScroll={Keyboard.dismiss}
            />
          :
          null
        }
      </View>
    );
  }
}

export default SearchUsersAutoCompleteList;

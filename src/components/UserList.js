import React, { Component } from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import Loader from '../components/Loader';
import PXTouchable from '../components/PXTouchable';
import PXThumbnailTouchable from '../components/PXThumbnailTouchable';
import FollowButtonContainer from '../containers/FollowButtonContainer';
import IllustItem from './IllustItem';
import NovelItem from './NovelItem';
import { SCREENS } from '../common/constants';

const AVATAR_SIZE = 50;
const PREVIEW_COLUMNS = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    marginBottom: 20,
  },
  imagePreviews: {
    flex: 1,
    flexDirection: 'row',
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 80,
    marginRight: 5,
    marginVertical: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'absolute',
    left: 10,
    right: 0,
    bottom: 10,
    flex: 1,
    width: AVATAR_SIZE,
  },
  footer: {
    marginBottom: 20,
  },
});

class UserList extends Component {
  renderItem = ({ item }) => {
    const { theme } = this.props;
    return (
      <View
        key={item.user.id}
        style={[
          styles.itemContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={styles.imagePreviews}>
          {item.illusts &&
            item.illusts.map((illust, index) =>
              <IllustItem
                key={`userIllust-${illust.id}`}
                illustId={illust.id}
                index={index}
                numColumns={PREVIEW_COLUMNS}
                onPressItem={() =>
                  this.handleOnPressIllustPreview(item.illusts, index)}
              />,
            )}
          {(!item.illusts || !item.illusts.length) &&
            item.novels &&
            item.novels.map((novel, index) =>
              <NovelItem
                key={`userNovel-${novel.id}`}
                gridView
                novelId={novel.id}
                index={index}
                numColumns={PREVIEW_COLUMNS}
                onPressItem={() =>
                  this.handleOnPressNovelPreview(item.novels, index)}
              />,
            )}
        </View>
        <View style={styles.userInfoContainer}>
          <PXTouchable
            style={styles.userInfo}
            onPress={() => this.handleOnPressAvatar(item.user.id)}
          >
            <Text>
              {item.user.name}
            </Text>
          </PXTouchable>
          <FollowButtonContainer userId={item.user.id} />
        </View>
        <View style={styles.avatarContainer}>
          <PXThumbnailTouchable
            uri={item.user.profile_image_urls.medium}
            size={AVATAR_SIZE}
            onPress={() => this.handleOnPressAvatar(item.user.id)}
          />
        </View>
      </View>
    );
  };

  renderFooter = () => {
    const { userList: { nextUrl } } = this.props;
    return nextUrl
      ? <View style={styles.footer}>
          <Loader />
        </View>
      : null;
  };

  handleOnPressIllustPreview = (illusts, index) => {
    const { push } = this.props.navigation;
    push(SCREENS.Detail, { items: illusts, index });
  };

  handleOnPressNovelPreview = (novels, index) => {
    const { push } = this.props.navigation;
    push(SCREENS.NovelDetail, { items: novels, index });
  };

  handleOnPressAvatar = userId => {
    const { push } = this.props.navigation;
    push(SCREENS.UserDetail, { userId });
  };

  render() {
    const {
      userList: { items, loading, loaded, refreshing },
      loadMoreItems,
      onRefresh,
      theme,
    } = this.props;
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {!loaded && loading && <Loader />}
        {items && items.length
          ? <FlatList
              data={items}
              keyExtractor={item => item.user.id.toString()}
              renderItem={this.renderItem}
              onEndReachedThreshold={0.1}
              onEndReached={loadMoreItems}
              ListFooterComponent={this.renderFooter}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          : null}
      </View>
    );
  }
}

export default UserList;

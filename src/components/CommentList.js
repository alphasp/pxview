import React, { Component } from 'react';
import { StyleSheet, Text, View, RefreshControl, FlatList } from 'react-native';
import moment from 'moment';
import { connectLocalization } from '../components/Localization';
import NoResult from '../components/NoResult';
import Loader from '../components/Loader';
import PXTouchable from '../components/PXTouchable';
import PXThumbnailTouchable from '../components/PXThumbnailTouchable';
import PXThumbnail from '../components/PXThumbnail';
import { globalStyles, globalStyleVariables } from '../styles';
import { SCREENS } from '../common/constants';

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    margin: 10,
  },
  nameCommentContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
  },
  authorBadge: {
    backgroundColor: globalStyleVariables.PRIMARY_COLOR,
    marginLeft: 5,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  authorBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  replyToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  replyToUserName: {
    marginLeft: 5,
  },
  date: {
    marginTop: 10,
    color: '#696969',
  },
  comment: {
    marginTop: 10,
  },
  nullResultContainer: {
    flex: 1,
    alignItems: 'center',
  },
  footer: {
    marginBottom: 20,
  },
});
class CommentList extends Component {
  handleOnPressExpandReplyTo = item => {
    const { authorId, navigation: { navigate } } = this.props;
    navigate(SCREENS.ReplyToCommentList, {
      data: {
        items: [item.parent_comment, item],
        loading: false,
        loaded: true,
        refreshing: false,
      },
      authorId,
    });
  };

  renderRow = ({ item }) => {
    const { authorId, i18n } = this.props;
    return (
      <View key={item.id} style={styles.commentContainer}>
        <PXThumbnailTouchable
          uri={item.user.profile_image_urls.medium}
          onPress={() => this.handleOnPressUser(item.user.id)}
        />
        <View style={styles.nameCommentContainer}>
          <View style={styles.nameContainer}>
            <PXTouchable onPress={() => this.handleOnPressUser(item.user.id)}>
              <Text style={styles.name}>
                {item.user.name}
              </Text>
            </PXTouchable>
            {item.user.id === authorId &&
              <View style={styles.authorBadge}>
                <Text style={styles.authorBadgeText}>
                  {i18n.commentWorkAuthor}
                </Text>
              </View>}
          </View>
          {item.parent_comment &&
            item.parent_comment.user &&
            item.parent_comment.user.id &&
            <PXTouchable
              style={styles.replyToContainer}
              onPress={() => this.handleOnPressExpandReplyTo(item)}
            >
              <PXThumbnail
                uri={item.parent_comment.user.profile_image_urls.medium}
                size={16}
              />
              <Text style={styles.replyToUserName}>
                {i18n.formatString(
                  i18n.commentInReplyTo,
                  item.parent_comment.user.name,
                )}
              </Text>
            </PXTouchable>}

          <View style={styles.comment}>
            <Text>
              {item.comment}
            </Text>
          </View>
          <Text style={styles.date}>
            {moment(item.date).format('YYYY-MM-DD HH:mm')}
          </Text>
        </View>
      </View>
    );
  };

  renderFooter = () => {
    const { data: { nextUrl, loading } } = this.props;
    return nextUrl && loading
      ? <View style={styles.footer}>
          <Loader />
        </View>
      : null;
  };

  handleOnPressUser = userId => {
    const { navigate } = this.props.navigation;
    navigate(SCREENS.UserDetail, { userId });
  };

  render() {
    const {
      data: { items, loading, loaded, refreshing },
      onRefresh,
      loadMoreItems,
      maxItems,
      i18n,
    } = this.props;
    return (
      <View style={globalStyles.container}>
        {!loaded && loading && <Loader />}
        {loaded
          ? <FlatList
              data={maxItems ? items.slice(0, maxItems) : items}
              keyExtractor={item => item.id.toString()}
              renderItem={this.renderRow}
              onEndReachedThreshold={0.1}
              onEndReached={loadMoreItems}
              removeClippedSubviews={false}
              ListFooterComponent={this.renderFooter}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          : null}
        {loaded &&
          (!items || !items.length) &&
          <NoResult text={i18n.noComments} />}
      </View>
    );
  }
}

export default connectLocalization(CommentList);

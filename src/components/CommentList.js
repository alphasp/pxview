/* eslint-disable camelcase */
import React, { Component } from 'react';
import { StyleSheet, View, RefreshControl, FlatList } from 'react-native';
import { withTheme, Text } from 'react-native-paper';
import Color from 'color';
import moment from 'moment';
import { connectLocalization } from './Localization';
import NoResult from './NoResult';
import Loader from './Loader';
import PXTouchable from './PXTouchable';
import PXThumbnailTouchable from './PXThumbnailTouchable';
import PXImage from './PXImage';
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
  dateAndReply: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    color: '#696969',
  },
  replyButtonText: {
    color: globalStyleVariables.PRIMARY_COLOR,
  },
  comment: {
    marginTop: 10,
  },
  stamp: {
    width: 100,
    height: 100,
    borderRadius: 10,
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
  handleOnPressUser = (userId) => {
    const {
      navigation: { push },
    } = this.props;
    push(SCREENS.UserDetail, { userId });
  };

  renderRow = ({ item }) => {
    const {
      authorId,
      i18n,
      onPressReplyCommentButton,
      renderCommentReplies,
      theme,
    } = this.props;
    return (
      <View key={item.id} style={styles.commentContainer}>
        <PXThumbnailTouchable
          uri={item.user.profile_image_urls.medium}
          onPress={() => this.handleOnPressUser(item.user.id)}
        />
        <View style={styles.nameCommentContainer}>
          <View style={styles.nameContainer}>
            <PXTouchable onPress={() => this.handleOnPressUser(item.user.id)}>
              <Text style={styles.name}>{item.user.name}</Text>
            </PXTouchable>
            {item.user.id === authorId && (
              <View style={styles.authorBadge}>
                <Text style={styles.authorBadgeText}>
                  {i18n.commentWorkAuthor}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.comment}>
            {item.comment ? <Text>{item.comment}</Text> : null}
            {item.stamp?.stamp_url && (
              <PXImage uri={item.stamp.stamp_url} style={styles.stamp} />
            )}
          </View>
          <View style={styles.dateAndReply}>
            <Text
              style={[
                styles.date,
                theme.dark && {
                  color: Color(theme.colors.text).alpha(0.7).string(),
                },
              ]}
            >
              {moment(item.date).format('YYYY-MM-DD HH:mm')}
            </Text>
            {onPressReplyCommentButton && (
              <>
                <Text> ・ </Text>
                <PXTouchable
                  onPress={() => onPressReplyCommentButton(item)}
                  hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                >
                  <Text style={styles.replyButtonText}>
                    {i18n.commentReply}
                  </Text>
                </PXTouchable>
              </>
            )}
          </View>
          {item.has_replies &&
            renderCommentReplies &&
            renderCommentReplies(item.id)}
        </View>
      </View>
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

  handleOnPressUser = (userId) => {
    const {
      navigation: { push },
    } = this.props;
    push(SCREENS.UserDetail, { userId });
  };

  renderList = () => {
    const {
      data: { items, refreshing },
      onRefresh,
      loadMoreItems,
      maxItems,
    } = this.props;
    if (maxItems) {
      return items.slice(0, maxItems).map((item) => {
        return this.renderRow({ item });
      });
    }
    return (
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={this.renderRow}
        onEndReachedThreshold={0.1}
        onEndReached={loadMoreItems}
        removeClippedSubviews={false}
        ListFooterComponent={this.renderFooter}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    );
  };

  render() {
    const {
      data: { items, loading, loaded },
      i18n,
      theme,
    } = this.props;
    return (
      <View
        style={[
          globalStyles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        {!loaded && loading && <Loader />}
        {loaded ? this.renderList() : null}
        {loaded && (!items || !items.length) && (
          <NoResult text={i18n.noComments} />
        )}
      </View>
    );
  }
}

export default withTheme(connectLocalization(CommentList));

import React, { Component } from 'react';
import { StyleSheet, Text, View, RefreshControl, FlatList } from 'react-native';
import moment from 'moment';
import { connectLocalization } from '../components/Localization';
import NoResult from '../components/NoResult';
import Loader from '../components/Loader';
import PXTouchable from '../components/PXTouchable';
import PXThumbnailTouchable from '../components/PXThumbnailTouchable';
import { globalStyles } from '../styles';
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
  date: {
    marginLeft: 10,
    fontSize: 10,
  },
  comment: {
    marginTop: 5,
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
  renderRow = ({ item }) =>
    <View key={item.id} style={styles.commentContainer}>
      <PXThumbnailTouchable
        uri={item.user.profile_image_urls.medium}
        onPress={() => this.handleOnPressUser(item.user.id)}
      />
      <View style={styles.nameCommentContainer}>
        <View style={styles.nameContainer}>
          <PXTouchable onPress={() => this.handleOnPressUser(item.user.id)}>
            <Text>
              {item.user.name}
            </Text>
          </PXTouchable>
          <Text style={styles.date}>
            {moment(item.date).format('YYYY-MM-DD HH:mm')}
          </Text>
        </View>
        <View style={styles.comment}>
          <Text>
            {item.comment}
          </Text>
        </View>
      </View>
    </View>;

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
              keyExtractor={item => item.id}
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

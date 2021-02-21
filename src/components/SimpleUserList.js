import React, { forwardRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Keyboard,
  RefreshControl,
} from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import PXTouchable from './PXTouchable';
import PXThumbnail from './PXThumbnail';
import FollowButtonContainer from '../containers/FollowButtonContainer';
import Loader from './Loader';
import Separator from './Separator';
import { globalStyles } from '../styles';
import { SCREENS } from '../common/constants';

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
  titleContainer: {
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
  },
});

const SimpleUserList = ({
  data: { items, loading, loaded, refreshing, nextUrl },
  onRefresh,
  loadMoreItems,
  title,
  innerRef,
}) => {
  const navigation = useNavigation();
  const theme = useTheme();

  const handleOnPressUser = (userId) => {
    const { push } = navigation;
    push(SCREENS.UserDetail, { userId });
  };

  const renderItem = ({ item }) => {
    return (
      <PXTouchable onPress={() => handleOnPressUser(item.user.id)}>
        <View style={styles.row}>
          <View style={styles.thumnailNameContainer}>
            <PXThumbnail
              uri={item.user.profile_image_urls.medium}
              // onPress={() => handleOnPressUser(item.user.id)}
            />
            <Text style={styles.username}>{item.user.name}</Text>
          </View>
          <FollowButtonContainer userId={item.user.id} />
        </View>
      </PXTouchable>
    );
  };

  const renderFooter = () => {
    return nextUrl ? (
      <View style={styles.footer}>
        <Loader />
      </View>
    ) : null;
  };

  return (
    <View
      style={[
        globalStyles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      {title && (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      {!loaded && loading && <Loader />}
      {items && items.length ? (
        <FlatList
          ref={innerRef}
          data={items}
          keyExtractor={(item) => item.user.id.toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={Separator}
          keyboardShouldPersistTaps="always"
          onEndReachedThreshold={0.1}
          onEndReached={loadMoreItems}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          removeClippedSubviews={false} // to prevent flatlist hidden after switch language
          onScroll={Keyboard.dismiss}
        />
      ) : null}
    </View>
  );
};

export default forwardRef((props, ref) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <SimpleUserList {...props} innerRef={ref} />
  );
});

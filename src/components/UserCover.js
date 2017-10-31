import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PXThumbnailTouchable from './PXThumbnailTouchable';
import PXTouchable from './PXTouchable';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  avatarContainer: {
    height: globalStyleVariables.DRAWER_WIDTH * 9 / 16,
    backgroundColor: globalStyleVariables.PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 0,
  },
  usernameContainer: {
    marginTop: 10,
  },
  authActionContainer: {
    flexDirection: 'row',
  },
  username: {
    color: '#fff',
  },
});

const UserCover = ({ user, avatarSize, onPressAvatar }) =>
  <View style={styles.avatarContainer}>
    <PXThumbnailTouchable
      key={user.profile_image_urls.px_170x170}
      uri={user.profile_image_urls.px_170x170}
      size={avatarSize || 70}
      style={styles.avatar}
      onPress={onPressAvatar}
    />
    <View style={styles.usernameContainer}>
      <PXTouchable onPress={onPressAvatar}>
        <Text style={styles.username}>
          {user.name}
        </Text>
      </PXTouchable>
    </View>
  </View>;

export default UserCover;

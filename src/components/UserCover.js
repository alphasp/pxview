import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PXThumbnailTouchable from './PXThumbnailTouchable';
import PXTouchable from './PXTouchable';
import PremiumBadge from './PremiumBadge';
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
    flexDirection: 'row',
    marginTop: 10,
  },
  authActionContainer: {
    flexDirection: 'row',
  },
  username: {
    color: '#fff',
    fontSize: 16,
  },
  premiumBadge: {
    marginLeft: 5,
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
      {user.is_premium && <PremiumBadge containerStyle={styles.premiumBadge} />}
    </View>
  </View>;

export default UserCover;

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PXThumbnailTouchable from './PXThumbnailTouchable';
import PXTouchable from './PXTouchable';
import PremiumBadge from './PremiumBadge';
import { THEME_TYPES } from '../common/constants';
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
  themeContainer: {
    bottom: 0,
    right: 0,
    position: 'absolute',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
});

const UserCover = ({
  user,
  avatarSize,
  onPressAvatar,
  onPressChangeTheme,
  themeName,
}) =>
  <View style={styles.avatarContainer}>
    <PXThumbnailTouchable
      key={user.profile_image_urls.px_170x170}
      uri={user.profile_image_urls.px_170x170}
      size={avatarSize || 70}
      style={styles.avatar}
      onPress={onPressAvatar}
    />
    <View style={styles.usernameContainer}>
      <PXTouchable
        onPress={onPressAvatar}
        hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
      >
        <Text style={styles.username}>
          {user.name}
        </Text>
      </PXTouchable>
      {user.is_premium && <PremiumBadge containerStyle={styles.premiumBadge} />}
    </View>
    <View style={styles.themeContainer}>
      <PXTouchable
        onPress={onPressChangeTheme}
        hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
      >
        <Icon
          name={themeName === THEME_TYPES.DARK ? 'md-sunny' : 'md-moon'}
          size={24}
          color="#fff"
        />
      </PXTouchable>
    </View>
  </View>;

export default UserCover;

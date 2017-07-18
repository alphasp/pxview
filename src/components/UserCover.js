import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PXThumbnailTouchable from './PXThumbnailTouchable';
import PXTouchable from './PXTouchable';
import OutlineButton from './OutlineButton';
import { globalStyleVariables } from '../styles';

const defaultProfileImage =
  'https://source.pixiv.net/common/images/no_profile.png';

const styles = StyleSheet.create({
  avatarContainer: {
    height: globalStyleVariables.DRAWER_WIDTH * 9 / 16,
    backgroundColor: globalStyleVariables.PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 16,
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

const UserCover = ({
  user,
  avatarSize,
  onPressAvatar,
  onPressLogin,
  onPressSignUp,
  i18n,
}) =>
  <View style={styles.avatarContainer}>
    <PXThumbnailTouchable
      key={(user && user.profile_image_urls.px_170x170) || defaultProfileImage}
      uri={(user && user.profile_image_urls.px_170x170) || defaultProfileImage}
      size={avatarSize || 70}
      style={styles.avatar}
      onPress={onPressAvatar}
    />
    <View style={styles.usernameContainer}>
      {user
        ? <PXTouchable onPress={onPressAvatar}>
            <Text style={styles.username}>
              {user.name}
            </Text>
          </PXTouchable>
        : <View style={styles.authActionContainer}>
            <OutlineButton
              text={i18n.signUp}
              style={{ borderColor: '#fff' }}
              textStyle={{ color: '#fff' }}
              onPress={onPressSignUp}
            />
            <OutlineButton
              text={i18n.login}
              style={{ marginLeft: 5, borderColor: '#fff' }}
              textStyle={{ color: '#fff' }}
              onPress={onPressLogin}
            />
          </View>}
    </View>
  </View>;

export default UserCover;

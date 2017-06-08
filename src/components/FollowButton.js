import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { connectLocalization } from './Localization';
import PXTouchable from './PXTouchable';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderColor: globalStyleVariables.PRIMARY_COLOR,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    padding: 8,
    color: globalStyleVariables.PRIMARY_COLOR,
  },
});

const FollowButton = props => {
  const {
    isFollow,
    onPress,
    onLongPress,
    i18n,
    buttonStyle,
    textStyle,
  } = props;
  return (
    <PXTouchable
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Text style={[styles.buttonText, textStyle]}>
        {isFollow ? i18n.following : i18n.follow}
      </Text>
    </PXTouchable>
  );
};

export default connectLocalization(FollowButton);

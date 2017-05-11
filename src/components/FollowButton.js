import React from 'react';
import { StyleSheet, Text } from 'react-native';
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
  const { isFollow, onPress, onLongPress } = props;
  return (
    <PXTouchable
      style={styles.button}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Text style={styles.buttonText}>{isFollow ? 'Following' : 'Follow'}</Text>
    </PXTouchable>
  );
};

export default FollowButton;

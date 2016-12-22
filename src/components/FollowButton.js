import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
} from 'react-native';
import PXTouchable from './PXTouchable';

const styles = StyleSheet.create({
  button: {
    //borderColor: '#5cafec',
    // borderRadius: 16,
    // borderWidth: 1,

    //justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    borderColor: '#5cafec',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    padding: 10,
    color: '#5cafec',
  }
});

const FollowButton = (props) => {
  const { isFollow, onPress, onLongPress } = props;
  return (
    <PXTouchable style={styles.button} onPress={onPress} onLongPress={onLongPress}>
      <Text style={styles.buttonText}>{isFollow ? "Following" : "Follow"}</Text>
    </PXTouchable> 
  );
}

export default FollowButton;

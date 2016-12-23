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
    backgroundColor: 'rgba(0,0,0,0)',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    padding: 10,
    color: '#000',
  }
});

const OutlineButton = (props) => {
  const { onPress, onLongPress, text, style, textStyle } = props;
  return (
    <PXTouchable style={[styles.button, style]} onPress={onPress} onLongPress={onLongPress}>
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </PXTouchable> 
  );
}

export default OutlineButton;

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  heart: {
    width: 25,
    height: 25
  },
  heartShape: {
    width: 10,
    height: 15,
    position: 'absolute',
    top: 0,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: '#6427d1',
  },
  leftHeart: {
    transform: [
      {
        rotate: '-45deg'
      }
    ],
    left: 5
  },
  rightHeart: {
    transform: [
      {
        rotate: '45deg'
      }
    ],
    right: 5
  }
});

class HeartShape extends Component {
  render() {
    const { color } = this.props;
    return (
      <View style={styles.heart}>
        <View style={[styles.heartShape, styles.leftHeart, { backgroundColor: color }]} />
        <View style={[styles.heartShape, styles.rightHeart, { backgroundColor: color }]} />
      </View>
    );
  }
}

export default HeartShape;

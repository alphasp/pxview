import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Loader from './Loader';
import PXCacheImage from './PXCacheImage';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  pageNumberContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

class PXCacheImageTouchable extends Component {
  constructor(props) {
    const { initWidth, initHeight } = props;
    super(props);
    this.state = {
      width: initWidth,
      height: initHeight,
      loading: true,
    };
  }

  handleOnFoundImageSize = (width, height, url) => {
    if (width && height) {
      const newWidth =
        width > globalStyleVariables.WINDOW_WIDTH
          ? globalStyleVariables.WINDOW_WIDTH
          : width;
      const newHeight =
        (width > globalStyleVariables.WINDOW_WIDTH
          ? globalStyleVariables.WINDOW_WIDTH
          : width) *
        height /
        width;
      this.setState({
        width: newWidth,
        height: newHeight,
        loading: false,
      });
      if (this.props.onFoundImageSize) {
        this.props.onFoundImageSize(newWidth, newHeight, url);
      }
    }
  };

  render() {
    const { uri, pageNumber, style, imageStyle, onPress } = this.props;
    const { height, loading } = this.state;
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View
          style={[
            style,
            {
              width: globalStyleVariables.WINDOW_WIDTH,
              height,
            },
          ]}
        >
          {loading &&
            pageNumber &&
            <View style={styles.pageNumberContainer}>
              <Text style={styles.pageNumberText}>
                {pageNumber}
              </Text>
            </View>}
          {loading && !pageNumber && <Loader />}
          <PXCacheImage
            uri={uri}
            style={imageStyle}
            onFoundImageSize={this.handleOnFoundImageSize}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default PXCacheImageTouchable;

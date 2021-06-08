import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTheme, Text } from 'react-native-paper';
import Loader from './Loader';
import PXTouchable from './PXTouchable';
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
        ((width > globalStyleVariables.WINDOW_WIDTH
          ? globalStyleVariables.WINDOW_WIDTH
          : width) *
          height) /
        width;
      this.setState({
        width: newWidth,
        height: newHeight,
        loading: false,
      });
      const { onFoundImageSize } = this.props;
      if (onFoundImageSize) {
        onFoundImageSize(newWidth, newHeight, url);
      }
    }
  };

  handleOnPressImage = () => {
    const { index, onPress } = this.props;
    if (onPress && index !== null) {
      onPress(index);
    }
  };

  handleOnLongPressImage = () => {
    const { index, onLongPress } = this.props;
    if (onLongPress && index !== null) {
      onLongPress(index);
    }
  };

  render() {
    const { uri, pageNumber, style, imageStyle, theme } = this.props;
    const { height, loading } = this.state;
    return (
      <PXTouchable
        onPress={this.handleOnPressImage}
        onLongPress={this.handleOnLongPressImage}
        style={[
          style,
          {
            width: globalStyleVariables.WINDOW_WIDTH,
            height,
            backgroundColor: theme.colors.surface,
          },
        ]}
        activeOpacity={1}
      >
        {loading && pageNumber && (
          <View style={styles.pageNumberContainer}>
            <Text style={styles.pageNumberText}>{pageNumber}</Text>
          </View>
        )}
        {loading && !pageNumber && <Loader />}
        <PXCacheImage
          uri={uri}
          style={imageStyle}
          onFoundImageSize={this.handleOnFoundImageSize}
        />
      </PXTouchable>
    );
  }
}

export default withTheme(PXCacheImageTouchable);

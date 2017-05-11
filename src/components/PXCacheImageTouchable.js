import React, { Component } from 'react';
import Loader from './Loader';
import PXTouchable from './PXTouchable';
import PXCacheImage from './PXCacheImage';
import { globalStyleVariables } from '../styles';

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
      const newWidth = width > globalStyleVariables.WINDOW_WIDTH
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
    const { uri, style, imageStyle, onPress } = this.props;
    const { width, height, loading } = this.state;
    return (
      <PXTouchable
        style={[
          style,
          {
            width,
            height,
          },
        ]}
        onPress={onPress}
      >
        {loading && <Loader />}
        <PXCacheImage
          uri={uri}
          style={imageStyle}
          onFoundImageSize={this.handleOnFoundImageSize}
        />
      </PXTouchable>
    );
  }
}

export default PXCacheImageTouchable;

import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import Loader from './Loader';
import PXTouchable from './PXTouchable';
import PXCacheImage from './PXCacheImage';

const windowWidth = Dimensions.get('window').width; // full width

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
      this.setState({
        width: width > windowWidth ? windowWidth : width,
        height: (width > windowWidth ? windowWidth : width) * height / width,
        loading: false,
      });
      if (this.props.onFoundImageSize) {
        this.props.onFoundImageSize(
          width > windowWidth ? windowWidth : width,
          (width > windowWidth ? windowWidth : width) * height / width,
          url,
        );
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

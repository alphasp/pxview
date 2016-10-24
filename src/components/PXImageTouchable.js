import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  RecyclerViewBackedScrollView,
} from 'react-native';
import Loader from './Loader';
import PXTouchable from './PXTouchable';
import PXImage from './PXImage';

const windowWidth = Dimensions.get('window').width; //full width
const windowHeight = Dimensions.get('window').height; //full height

class PXImageTouchable extends Component {
  constructor(props) {
    const { initWidth, initHeight } = props;
    super(props);
    this.state = {
      width: initWidth,
      height: initHeight,
      loading: true
    };
  }
  handleOnFoundImageSize = (width, height) => {
    if (width && height) {
      this.setState({
        width: (width > windowWidth) ? windowWidth : width,
        height: (width > windowWidth ? windowWidth : width) * height / width,
        loading: false
      })
      if (this.props.onFoundImageSize) {
        this.props.onFoundImageSize(width > windowWidth ? windowWidth : width, (width > windowWidth ? windowWidth : width) * height / width);
      }
    }
  }

  render() {
    const { uri, style, imageStyle, onPress } = this.props;
    const { width, height, loading } = this.state;
    return (
      <PXTouchable 
        style={[style,{ 
          width: width,
          height: height
        }]}
      >
        {
          loading &&
          <Loader />
        }
        <PXImage 
          uri={uri}
          style={imageStyle}
          onFoundImageSize={this.handleOnFoundImageSize}
        />
      </PXTouchable>
    );
  }
}

export default PXImageTouchable;
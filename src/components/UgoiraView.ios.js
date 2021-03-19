import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { globalStyleVariables } from '../styles';

class UgoiraView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageIndex: 0,
    };
    this.frame = null;
    this.lastFrameTime = null;
    this.currentFramePlayedTime = 0;
  }

  componentDidMount() {
    this.resumeFrame();
  }

  componentDidUpdate(prevProps) {
    const { paused } = this.props;
    const { paused: prevPaused } = prevProps;
    if (paused !== null && paused !== prevPaused) {
      if (paused) {
        this.pauseFrame();
      } else {
        this.resumeFrame();
      }
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frame);
  }

  displayFrame = () => {
    const { images } = this.props;
    const { imageIndex } = this.state;
    const now = new Date();
    if (now - this.lastFrameTime > images[imageIndex].delay) {
      this.lastFrameTime = now;
      const index = imageIndex + 1;
      if (index >= images.length) {
        this.setState({
          imageIndex: 0,
        });
      } else {
        this.setState({ imageIndex: index });
      }
    }
    this.frame = requestAnimationFrame(() => this.displayFrame());
  };

  pauseFrame = () => {
    this.currentFramePlayedTime = new Date() - this.lastFrameTime;
    cancelAnimationFrame(this.frame);
  };

  resumeFrame = () => {
    this.lastFrameTime = new Date() - this.currentFramePlayedTime;
    this.frame = requestAnimationFrame(() => this.displayFrame());
  };

  render() {
    const { images, width, height, resizeMode } = this.props;
    const { imageIndex } = this.state;
    return (
      <View
        style={{
          width: globalStyleVariables.WINDOW_WIDTH,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
        }}
      >
        <Image
          source={{
            uri: images[imageIndex].uri,
          }}
          style={{
            width,
            height,
          }}
          resizeMode={resizeMode}
        />
      </View>
    );
  }
}
export default UgoiraView;

import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { globalStyleVariables } from '../styles';

class UgoiraView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageIndex: 0,
    };
  }

  componentDidMount() {
    const { images } = this.props;
    const { imageIndex } = this.state;
    const { delay } = images[imageIndex];
    this.remaining = delay;
    this.displayFrame(this.remaining);
  }

  componentWillReceiveProps(nextProps) {
    const { paused: prevPaused } = this.props;
    const { paused } = nextProps;
    if (paused !== null && paused !== prevPaused) {
      if (paused) {
        this.pauseFrame();
      } else {
        this.resumeFrame();
      }
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  displayFrame = delay => {
    this.timer = setTimeout(() => {
      const { images } = this.props;
      const { imageIndex } = this.state;
      const index = imageIndex + 1;
      if (index >= images.length) {
        this.setState({
          imageIndex: 0,
        });
      }
      this.nextFrame();
    }, delay);
  };

  nextFrame = () => {
    const { images } = this.props;
    const { imageIndex } = this.state;
    const index = imageIndex + 1;
    this.setState({ imageIndex: index });
    this.displayFrame(images[index].delay);
  };

  pauseFrame = () => {
    clearTimeout(this.timer);
    this.remaining -= new Date() - this.start;
  };

  resumeFrame = () => {
    this.start = new Date();
    clearTimeout(this.timer);
    this.displayFrame(this.remaining);
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

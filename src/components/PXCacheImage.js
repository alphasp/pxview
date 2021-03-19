import React, { Component } from 'react';
import { View, Image, InteractionManager } from 'react-native';
import { globalStyleVariables } from '../styles';

class PXCacheImage extends Component {
  mounted = false;

  constructor(props) {
    super(props);
    const { width, height } = props;
    this.state = {
      width,
      height,
    };
  }

  componentDidMount() {
    const { uri, onFoundImageSize } = this.props;
    this.mounted = true;
    InteractionManager.runAfterInteractions(() => {
      Image.getSizeWithHeaders(
        uri,
        {
          referer: 'http://www.pixiv.net',
        },
        (width, height) => {
          if (this.mounted) {
            this.setState({
              width,
              height,
            });
            onFoundImageSize(width, height, uri);
          }
        },
      );
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { uri, style, ...otherProps } = this.props;
    const { width, height } = this.state;
    return width && height ? (
      <View
        style={{
          width: globalStyleVariables.WINDOW_WIDTH,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor: '#fff',
        }}
      >
        <Image
          source={{
            uri,
            headers: {
              referer: 'http://www.pixiv.net',
            },
          }}
          style={[
            {
              width:
                width > globalStyleVariables.WINDOW_WIDTH
                  ? globalStyleVariables.WINDOW_WIDTH
                  : width,
              height: (globalStyleVariables.WINDOW_WIDTH * height) / width,
            },
            style,
          ]}
          {...otherProps}
        />
      </View>
    ) : null;
  }
}

export default PXCacheImage;

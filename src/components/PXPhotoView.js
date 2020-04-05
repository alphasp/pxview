import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import PhotoView from 'react-native-photo-view-ex';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  photo: {
    width: globalStyleVariables.WINDOW_WIDTH,
    height: globalStyleVariables.WINDOW_HEIGHT,
  },
});

class PXPhotoView extends PureComponent {
  handleOnLoad = () => {
    const { onLoad, uri } = this.props;
    onLoad(uri);
  };

  render() {
    const { uri, style, onLoad, ...restProps } = this.props;
    return (
      <PhotoView
        source={{
          uri,
          headers: {
            referer: 'http://www.pixiv.net',
          },
        }}
        resizeMode="contain"
        androidScaleType="fitCenter"
        minimumZoomScale={1}
        maximumZoomScale={3}
        style={[styles.photo, style]}
        onLoad={this.handleOnLoad}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restProps}
      />
    );
  }
}

export default PXPhotoView;

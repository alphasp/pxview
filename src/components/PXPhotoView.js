import React from 'react';
import { useWindowDimensions } from 'react-native';
import PhotoView from 'react-native-photo-view-ex';

export default function PXPhotoView({ uri, style, onLoad, ...restProps }) {
  const { width, height } = useWindowDimensions();

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
      style={{ ...style, width, height }}
      onLoad={() => onLoad(uri)}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restProps}
    />
  );
}

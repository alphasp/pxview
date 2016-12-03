import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import Swiper from 'react-native-swiper'
import PhotoView from 'react-native-photo-view'
const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  // wrapper: {
  //   top: 30,
  //   right: 0,
  //   position: 'absolute',
  //   //justifyContent: 'center',
  //   backgroundColor: 'red',
  //   borderRadius: 10,
  //   paddingHorizontal: 8,
  //   // height: 32,
  // },

  wrapper: {
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  photo: {
    width,
    height,
    flex: 1
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  thumbWrap: {
    marginTop: 100,
    borderWidth: 5,
    borderColor: '#000',
    flexDirection: 'row'
  },
  thumb: {
    width: 50,
    height: 50
  },
});

const ImagesViewer = (props) => {
  const { items, viewerIndex } = props;
  console.log(viewerIndex)
  return (
    <View style={styles.wrapper}>
      <Swiper 
        index={viewerIndex} 
      >
        {
          items.map((item, i) => {
            return (
              <View key={i} style={styles.slide}>
                <PhotoView
                  source={{
                    uri: item.cache,
                  }}
                  resizeMode='contain'
                  minimumZoomScale={0.5}
                  maximumZoomScale={3}
                  androidScaleType='fitCenter'
                  style={styles.photo} 
                />
              </View>
            )
          })
        }
      </Swiper>
    </View>
  );
}

export default ImagesViewer;

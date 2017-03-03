import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  CameraRoll,
} from 'react-native';
import Swiper from 'react-native-swiper';
import PhotoView from 'react-native-photo-view';
import RNFetchBlob from 'react-native-fetch-blob';
import Icon from 'react-native-vector-icons/FontAwesome';
import PXTouchable from '../components/PXTouchable';
//import PXPhotoView from './PXPhotoView';

const { width, height } = Dimensions.get('window');

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
    // backgroundColor: '#000',
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
    //flex: 1
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

const downloadImage = (images, index) => {
  const { dirs } = RNFetchBlob.fs;
  const imageUrl = images[index].url;
  const fileName = imageUrl.split('/').pop().split('#')[0].split('?')[0];
  this.task = RNFetchBlob
    .config({
      path :`${dirs.DocumentDir}/${fileName}`,
      //appendExt: 'png',
      //key: uri,
      //session: moment().startOf('day'),
    }).fetch('GET', imageUrl, {
      referer: "http://www.pixiv.net",
      //'Cache-Control' : 'no-store'
    }).then(res => {
      console.log('The file saved to ', res.path());
      CameraRoll.saveToCameraRoll(res.path()).then(result => {
        console.log('save succeeded to camera roll ', result);
      }).catch(err => {
        console.log('save failed to camera roll ', err);
      });
    })
    .catch((err, statusCode) => {
      // error handling
      console.log('error fetch blob ', err)
    });
}

class ImagesViewer extends Component {
  static navigationOptions = {
    header: (navigation, defaultHeader) => {
      const { state, setParams, navigate, goBack, dispatch } = navigation;
      const { images, viewerIndex } = state.params;
      return {
        ...defaultHeader,
        right: (
          <PXTouchable onPress={() => downloadImage(images, viewerIndex)}>
            <Icon 
              name="floppy-o" 
              size={20} 
              style={{padding: 10}}
            />
          </PXTouchable>
        )
      }
    }
  }

  onMomentumScrollEnd = (e, state, context) => {
    const { setParams } = this.props.navigation;
    const { index } = state
    setParams({
      viewerIndex: index
    });
  }

  render() {
    const { images, viewerIndex } = this.props.navigation.state.params;
    console.log('viewerIndex ', viewerIndex)
    return (
      <View style={styles.wrapper}>
        <Swiper 
          index={viewerIndex} 
          onMomentumScrollEnd={this.onMomentumScrollEnd}
        >
          {
            images.map((image, i) => {
              return (
                <View key={i} style={styles.slide}>
                  <PhotoView
                    source={{
                      uri: image.url,
                      headers: {
                        referer: "http://www.pixiv.net"
                      }
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
}

export default ImagesViewer;
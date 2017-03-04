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
import Loader from '../components/Loader';
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

  container: {
    // // backgroundColor: '#000',
    // position: 'absolute',
    // top: 0,
    // right: 0,
    // bottom: 0,
    // left: 0,
    flex: 1,
  },
  slide: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  photo: {
    width,
    height,
    flex: 1,
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

class ImagesViewer extends Component {
  static navigationOptions = {
    header: (navigation, defaultHeader) => {
      const { openBottomSheet } = navigation.state.params;
      return {
        ...defaultHeader,
        right: (
          <PXTouchable onPress={openBottomSheet}>
            <Icon 
              name="ellipsis-v" 
              size={20} 
              style={{paddingVertical: 10, paddingHorizontal: 20}}
            />
          </PXTouchable>
        )
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    const { navigation, screenProps: { openBottomSheet } } = this.props;
    const { images, viewerIndex } = navigation.state.params;
    const openImages = [images[viewerIndex]];
    navigation.setParams({ 
      openBottomSheet: () => openBottomSheet(openImages)
    });
  }

  handleOnMomentumScrollEnd = (e, state, context) => {
    const { setParams } = this.props.navigation;
    const { index } = state;
    setParams({ viewerIndex: index });
  }

  handleOnImageLoaded = () => {
    console.log('loaded')
    this.setState({ loading: false });
  }

  render() {
    const { images, viewerIndex } = this.props.navigation.state.params;
    const { loading } = this.state;
    console.log('viewerIndex ', viewerIndex)
    return (
      <View style={styles.container}>
        <Swiper 
          index={viewerIndex} 
          onMomentumScrollEnd={this.handleOnMomentumScrollEnd}
        >
          {
            images.map((image, i) => {
              return (
                <View key={i} style={styles.slide}>
                  {
                    loading &&
                    <Loader />
                  }
                  <PhotoView
                    source={{
                      uri: image,
                      headers: {
                        referer: "http://www.pixiv.net"
                      }
                    }}
                    onLoad={this.handleOnImageLoaded}
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
    /*return (
      <View style={styles.container}>
        <Swiper 
          index={viewerIndex} 
          onMomentumScrollEnd={this.handleOnMomentumScrollEnd}
        >
          {
            images.map((image, i) => {
              return (
                <View key={i} style={styles.slide}>
                  {
                    loading &&
                    <Loader />
                  }
                  <PhotoView
                    source={{
                      uri: image,
                      headers: {
                        referer: "http://www.pixiv.net"
                      }
                    }}
                    onLoad={this.handleOnImageLoaded}
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
    );*/
  }
}

export default ImagesViewer;
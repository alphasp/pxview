import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  DeviceEventEmitter,
  CameraRoll
} from 'react-native';
import { connect } from 'react-redux'
import { addNavigationHelpers } from 'react-navigation';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import RNFetchBlob from 'react-native-fetch-blob';
import Toast, { DURATION } from 'react-native-easy-toast';
import { ShareSheet } from 'react-native-share';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppNavigator from '../navigations/AppNavigator';
import PXTouchable from '../components/PXTouchable';
import { resetError } from '../common/actions/error';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class Master extends Component {
  constructor(props){
    super(props);
    this.state = {
      isShowBottomSheet: false,
      imageUrls: []
    };
  }

  componentDidMount() {
    MessageBarManager.registerMessageBar(this.messageBarAlert);
    this.listener = DeviceEventEmitter.addListener('showToast', (text) => {
      this.toast.show(text, DURATION.LENGTH_LONG);
    });
    //DeviceEventEmitter.emit('showToast', 'Maximum of tags is 10');
  }

  componentWillUnmount() {
    MessageBarManager.unregisterMessageBar();
    if (this.listener) {
      this.listener.remove();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { routes, dispatch } = this.props;
    const { routes: nextRoutes, error } = nextProps;
    const nextMessageBar = nextProps.messageBar
    const { messageBar } = this.props
    if (error){
      MessageBarManager.hideAlert();
      MessageBarManager.showAlert({
        message: error,
        titleNumberOfLines: 0,
        alertType: 'error',
      });
    }
    if (routes.scene.name != nextRoutes.scene.name){
      //maybe need to reset error on REACT_NATIVE_ROUTER_FLUX_FOCUS
      dispatch(resetError());
      // if (!isAuthLoaded(nextProps)) {
      //   dispatch(loadUserAuth())
      // }
    }
  }

  openBottomSheet = (imageUrls) => {
    console.log('openBottomSheet')
    this.setState({ isShowBottomSheet: true, imageUrls });
  }

  handleOnCancelBottomSheet = () => {
    //const { setParams } = this.props.navigation;
    console.log('handleOnCancelBottomSheet')
    this.setState({ isShowBottomSheet: false });
  }

  handleOnPressSaveImages = () => {
    const { imageUrls } = this.state;
    console.log('dl images ', imageUrls)
    const { dirs } = RNFetchBlob.fs;
    this.handleOnCancelBottomSheet();
    const downloadImagePromises = imageUrls.map(url => {
      const fileName = url.split('/').pop().split('#')[0].split('?')[0];
      return RNFetchBlob
        .config({
          path :`${dirs.DocumentDir}/${fileName}`,
        }).fetch('GET', url, {
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
        }).then(() => {
          return null;
        });
    })
    return Promise.all(downloadImagePromises).then((results) => {
      console.log('finish download all images ', results);
    });
  }

  render() {
    // const { navigationState: { children } } = this.props;
    const { isShowBottomSheet, imageUrls } = this.state;
    return (
      <View style={styles.container}>
        <AppNavigator screenProps={{openBottomSheet: this.openBottomSheet}} />
        <MessageBar ref={ref => this.messageBarAlert = ref}/>
        <Toast ref={ref => this.toast = ref} />
        <ShareSheet 
          visible={isShowBottomSheet}
          onCancel={this.handleOnCancelBottomSheet}
        >
          <View style={{padding: 15}}>
            <PXTouchable onPress={this.handleOnPressSaveImages}>
              <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                <Icon 
                  name="floppy-o" 
                  size={20} 
                />
                {}
                <Text style={{marginLeft: 15}}>
                  { imageUrls.length > 1 ? "Save All Images" : "Save Image" }
                </Text>
              </View>
            </PXTouchable>
            <PXTouchable onPress={this.handleOnCancelBottomSheet}>
              <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop: 15 }}>
                <Icon 
                  name="times" 
                  size={20} 
                />
                <Text style={{marginLeft: 15}}>Cancel</Text>
              </View>
            </PXTouchable>
          </View>
        </ShareSheet>
      </View>
    );
    //        <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />

  }
}

export default connect(state => {
  return {
    error: state.error,
    routes: state.routes,
  }
})(Master);
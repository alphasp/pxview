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
import IonicIcon from 'react-native-vector-icons/Ionicons';
import AppNavigator from '../navigations/AppNavigator';
import PXTouchable from '../components/PXTouchable';
import FollowModal from './FollowModal';
import { localizedStrings } from '../common/helpers/i18n';
import { resetError } from '../common/actions/error';
import * as followUserActionCreators from '../common/actions/followUser';
import { RANKING, R18_RANKING } from '../common/constants/illustRanking';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheet: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  bottomSheetText: {
    marginLeft: 32
  },
  bottomSheetListItem: {
    flexDirection: "row", 
    justifyContent: "flex-start", 
    alignItems: "center",
    height: 48
  },
  bottomSheetCancelIcon: {
    marginLeft: 3
  },
  bottomSheetCancelText: {
    marginLeft: 36
  }
});

class Master extends Component {
  constructor(props){
    super(props);
    this.state = {
      isShowBottomSheet: false,
      isShowRankingModeBottomSheet: false,
      imageUrls: [],
      isOpenFollowModal: false,
      selectedUserId: null,
      isFollowSelectedUser: false
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

  openRankingModeBottomSheet = (selectedUserId) => {
    this.setState({ isShowRankingModeBottomSheet: true });
  }

  openFollowModal = (selectedUserId, isFollowSelectedUser) => {
    this.setState({ isOpenFollowModal: true, selectedUserId, isFollowSelectedUser });
  }

  handleOnPressModalFollowButton = (userId, followType) => {
    this.followUser(userId, followType);
    this.handleOnPressCloseFollowModalButton();
  }

  handleOnPressCloseFollowModalButton = () => {
    this.setState({
      selectedUserId: null,
      isOpenFollowModal: false
    });
  }

  handleOnPressModalRemoveButton = (userId) => {
    this.unFollowUser(userId);
    this.handleOnPressCloseFollowModalButton();
  }

  handleOnCancelBottomSheet = () => {
    //const { setParams } = this.props.navigation;
    console.log('handleOnCancelBottomSheet')
    this.setState({ isShowBottomSheet: false });
  }

  handleOnCancelRankingModeBottomSheet = () => {
    this.setState({ isShowRankingModeBottomSheet: false });
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

  handleOnPressRankingMode = (ranking) => {
    console.log('selected ', ranking)
    this.handleOnCancelRankingModeBottomSheet();
  }

  followUser = (userId, followType) => {
    const { followUser } = this.props;
    followUser(userId, followType);
  }

  unFollowUser = (userId) => {
    const { unFollowUser } = this.props;
    unFollowUser(userId);
  }

  render() {
    const { user } = this.props;
    const { isShowBottomSheet, isShowRankingModeBottomSheet, imageUrls, isOpenFollowModal, selectedUserId, isFollowSelectedUser } = this.state;
    return (
      <View style={styles.container}>
        <AppNavigator 
          screenProps={{
            openBottomSheet: this.openBottomSheet,
            openRankingModeBottomSheet: this.openRankingModeBottomSheet,
            openFollowModal: this.openFollowModal,
            strings: localizedStrings
          }} 
        />
        <MessageBar ref={ref => this.messageBarAlert = ref}/>
        <Toast ref={ref => this.toast = ref} />
        <ShareSheet 
          visible={isShowBottomSheet}
          onCancel={this.handleOnCancelBottomSheet}
        >
          <View style={styles.bottomSheet}>
            <PXTouchable onPress={this.handleOnPressSaveImages}>
              <View style={styles.bottomSheetListItem}>
                <Icon 
                  name="floppy-o" 
                  size={24} 
                />
                <Text style={styles.bottomSheetText}> 
                  { imageUrls.length > 1 ? "Save All Images" : "Save Image" }
                </Text>
              </View>
            </PXTouchable>
            <PXTouchable onPress={this.handleOnCancelBottomSheet}>
              <View style={styles.bottomSheetListItem}>              
                <IonicIcon 
                  name="md-close" 
                  size={24} 
                  style={styles.bottomSheetCancelIcon}
                />
                <Text style={[styles.bottomSheetText, styles.bottomSheetCancelText]}>
                  Cancel
                </Text>
              </View>
            </PXTouchable>
          </View>
        </ShareSheet>
        <ShareSheet 
          visible={isShowRankingModeBottomSheet}
          onCancel={this.handleOnCancelRankingModeBottomSheet}
        >
          <View style={styles.bottomSheet}>
            {
              Object.keys(RANKING).map(ranking => {
                return (
                  <PXTouchable key={ranking} onPress={() => this.handleOnPressRankingMode(ranking)}>
                    <View style={styles.bottomSheetListItem}>
                      <IonicIcon 
                        name="md-funnel" 
                        size={24} 
                      />
                      <Text style={styles.bottomSheetText}>
                        {RANKING[ranking].en}
                      </Text>
                    </View>
                  </PXTouchable>
                )
              })
            }
            {
              user &&
              Object.keys(R18_RANKING).map(ranking => {
                return (
                  <PXTouchable key={ranking} onPress={() => this.handleOnPressRankingMode(ranking)}>
                    <View style={styles.bottomSheetListItem}>
                      <IonicIcon 
                        name="md-funnel" 
                        size={24} 
                      />
                      <Text style={styles.bottomSheetText}>
                        {R18_RANKING[ranking].en}
                      </Text>
                    </View>
                  </PXTouchable>
                )
              })
            }
            <PXTouchable onPress={this.handleOnCancelRankingModeBottomSheet}>
              <View style={styles.bottomSheetListItem}>
                <IonicIcon 
                  name="md-close" 
                  size={24} 
                  style={styles.bottomSheetCancelIcon}
                />
                <Text style={[styles.bottomSheetText, styles.bottomSheetCancelText]}>
                  Cancel
                </Text>
              </View>
            </PXTouchable>
          </View>
        </ShareSheet>
        {
          isOpenFollowModal && selectedUserId &&
          <FollowModal 
            userId={selectedUserId}
            isOpen={isOpenFollowModal}
            isFollow={isFollowSelectedUser}
            onPressFollowButton={this.handleOnPressModalFollowButton}
            onPressRemoveButton={this.handleOnPressModalRemoveButton}
            onPressCloseButton={this.handleOnPressCloseFollowModalButton}
          />
        }
      </View>
    );
  }
}

export default connect(state => {
  return {
    error: state.error,
    routes: state.routes,
    user: state.auth.user,
    lang: state.i18n.lang
  }
}, followUserActionCreators)(Master);
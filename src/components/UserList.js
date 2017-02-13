import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ListView,
  RecyclerViewBackedScrollView,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../components/Loader';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';
import PXThumbnail from '../components/PXThumbnail';
import PXThumbnailTouchable from '../components/PXThumbnailTouchable';
import FollowButton from '../components/FollowButton';
import OverlayImagePages from '../components/OverlayImagePages';
import FollowModal from '../containers/FollowModal';
import * as followUserActionCreators from '../common/actions/followUser';
import { FollowType } from '../common/actions/followUser';

const windowWidth = Dimensions.get('window').width; //full width
const windowHeight = Dimensions.get('window').height; //full height
const avatarSize = 50;
const ILLUST_PREVIEW_COLUMNS = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#E9EBEE',
  },
  imagePreviews: {
    flex: 1,
    flexDirection: 'row',
  },
  userInfoContainer: {
    //backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //margin: 5,
    marginLeft: 80,
    marginRight: 5,
    marginVertical: 5,
    //left: 70,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'absolute',
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
    //top: 0,
    left: 10,
    right: 0,
    bottom: 10,
    flex: 1,
    width: avatarSize
    //paddingBottom: 40
  }
});

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      dataSource:  new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      selectedUserId: null,
      isFollowSelectedUser: false,
      isOpenFollowModal: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { userList: { items: prevItems } } = this.props;
    const { userList: { items } } = nextProps;
    if (items && items !== prevItems) {
      const { dataSource } = this.state;
      this.setState({
        dataSource: dataSource.cloneWithRows(items)
      });
    }
  }

  renderRow = (item) => {
    return (
      <View
        key={item.user.id}
        style={{ 
          backgroundColor: '#fff',
          marginBottom: 20,
        }} 
      >
        <View style={styles.imagePreviews}>
          {
            item.illusts &&
            item.illusts.map(illust => {
              return (
                <PXTouchable 
                  style={{ 
                    borderWidth: 1,
                    borderColor: '#E9EBEE',
                    width: windowWidth / ILLUST_PREVIEW_COLUMNS - 1, 
                    height: windowWidth / ILLUST_PREVIEW_COLUMNS - 1,
                  }} 
                  key={illust.id} 
                  onPress={() => this.handleOnPressImagePreview(illust)}
                >
                  <View>
                    <PXImage 
                      uri={illust.image_urls ? illust.image_urls.square_medium : ""}
                      style={[styles.cardImage, {
                        resizeMode: 'cover',
                        width: windowWidth / ILLUST_PREVIEW_COLUMNS - 1, 
                        height: windowWidth / ILLUST_PREVIEW_COLUMNS - 1,
                      }]}
                    />
                    {
                      (illust.meta_pages && illust.meta_pages.length) ?
                      <OverlayImagePages total={illust.meta_pages.length} />
                      :
                      null
                    }
                  </View>
                </PXTouchable>
              )
            })
          }
        </View>
        <View style={styles.userInfoContainer}>
          <PXTouchable 
            style={styles.userInfo}
            onPress={() => this.handleOnPressAvatar(item)}
          >
            <Text>{item.user.name}</Text>
          </PXTouchable>
          <FollowButton 
            isFollow={item.user.is_followed} 
            onLongPress={() => this.handleOnLongPressFollowButton(item.user)}
            onPress={() => this.handleOnPressFollowButton(item.user)}
          />
        </View>
        <View style={styles.avatarContainer}>
          <PXThumbnailTouchable
            uri={item.user.profile_image_urls.medium}
            size={avatarSize}
            style={{
              borderColor: '#E9EBEE',
              borderWidth: 1
            }}
            onPress={() => this.handleOnPressAvatar(item.user.id)}
          />
        </View>
      </View>
    );
  }

  handleOnLongPressFollowButton = (user) => {
    this.setState({
      selectedUserId: user.id,
      isFollowSelectedUser: user.is_followed,
      isOpenFollowModal: true,
    });
  }

  handleOnPressImagePreview= (item) => {
    const { navigate } = this.props.navigation;
    navigate('Detail', { item });
  }

  handleOnPressAvatar = (userId) => {
    const { navigate } = this.props.navigation;
    navigate('UserDetail', { userId });
  }

  handleOnPressFollowButton = (user) => {
    if (user.is_followed) {
      this.unFollowUser(user.id);
    }
    else {
      this.followUser(user.id, FollowType.PUBLIC);
    }
  }

  handleOnPressModalFollowButton = (userId, followType) => {
    this.followUser(userId, followType);
    this.handleOnPressCloseFollowModalButton();
  }

  handleOnPressModalRemoveButton = (userId) => {
    this.unFollowUser(userId);
    this.handleOnPressCloseFollowModalButton();
  }

  handleOnPressCloseFollowModalButton = () => {
    this.setState({
      selectedUserId: null,
      isFollow: false,
      isOpenFollowModal: false
    });
  }

  followUser = (userId, followType) => {
    const { followUser } = this.props;
    followUser(userId, followType);
  }

  unFollowUser = (userId) => {
    const { unFollowUser } = this.props;
    unFollowUser(userId);
  }

  renderFooter = () => {
    const { userList: { nextUrl } } = this.props;
    return (
      nextUrl ?
      <View style={{ marginBottom: 20 }}>
        <Loader />
      </View>
      :
      null
    )
  }

  render() {
    const { userList: { items, loading, loaded }, loadMore, refreshing, onRefresh } = this.props;
    const { dataSource, selectedUserId, isFollowSelectedUser, isOpenFollowModal } = this.state;
    return (
      <View style={styles.container}>
        {
          !loaded && loading &&
          <Loader />
        }
        {
          (items && items.length) ?
          <ListView
            dataSource={dataSource}
            renderRow={this.renderRow}
            enableEmptySections={ true }
            renderFooter={this.renderFooter}
            onEndReached={loadMore}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />
          :
          null
        }
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

//followActionCreators
export default connect(null, followUserActionCreators)(UserList);
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
import OverlayImagePages from '../components/OverlayImagePages';

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
    marginVertical: 5
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
          <PXTouchable>
            <Text>Follow</Text>
          </PXTouchable>
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

  handleOnPressImagePreview= (item) => {
    Actions.detail({ item: item });
  }

  handleOnPressAvatar = (userId) => {
    Actions.userDetail({ userId });
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
    const { dataSource } = this.state;
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
      </View>
    );
  }
}

export default UserList;
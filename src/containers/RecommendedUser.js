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
import GridView from 'react-native-grid-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../components/Loader';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';
import PXThumbnail from '../components/PXThumbnail';
import PXThumbnailTouchable from '../components/PXThumbnailTouchable';
import OverlayImagePages from '../components/OverlayImagePages';
import { 
  fetchRecommendedUsers, 
  clearRecommendedUsers, 
} from '../common/actions/recommendedUser';

const windowWidth = Dimensions.get('window').width; //full width
const windowHeight = Dimensions.get('window').height; //full height
const avatarSize = 50;

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

class RecommendedUser extends Component {
  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
    this.state = { 
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchRecommendedUsers());
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
                    width: windowWidth / item.illusts.length - 1, 
                    height: windowWidth / item.illusts.length - 1,
                  }} 
                  key={illust.id} 
                  onPress={() => this.handleOnPressImagePreview(illust)}
                >
                  <PXImage 
                    uri={illust.image_urls.square_medium}
                    style={[styles.cardImage, {
                      resizeMode: 'cover',
                      width: windowWidth / item.illusts.length - 1, 
                      height: windowWidth / item.illusts.length - 1,
                    }]}
                  />
                  {
                    (illust.meta_pages && illust.meta_pages.length) ?
                    <OverlayImagePages total={illust.meta_pages.length} />
                    :
                    null
                  }
                </PXTouchable>
              )
            })
          }
        </View>
        <View style={styles.userInfoContainer}>
          <PXTouchable style={styles.userInfo}>
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
          />
        </View>
      </View>
    );
  }

  handleOnPressImagePreview= (item) => {
    Actions.detail({ item: item });
  }

  loadMoreUsers= () => {
    const { dispatch, recommendedUser: { nextUrl } } = this.props;
    console.log('load more ', nextUrl)
    if (nextUrl) {
      dispatch(fetchRecommendedUsers(null, nextUrl));
    }
  }

  handleOnRefresh = () => {
    const { dispatch } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearRecommendedUsers());
    dispatch(fetchRecommendedUsers()).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  renderFooter = () => {
    const { recommendedUser: { nextUrl } } = this.props;
    //todo hide footer if done
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
    const { recommendedUser: { items, loading, loaded } } = this.props;
    const { refreshing } = this.state;
    const dataSource = this.dataSource.cloneWithRows(items);
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
            renderScrollComponent={ props => <RecyclerViewBackedScrollView {...props} />}
            renderFooter={this.renderFooter}
            onEndReached={this.loadMoreUsers}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.handleOnRefresh}
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

export default connect(state => {
  return {
    recommendedUser: state.recommendedUser
  }
})(RecommendedUser);
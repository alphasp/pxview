import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  ListView,
  RecyclerViewBackedScrollView,
  InteractionManager,
  Platform,
  PanResponder,
  Linking,
  Navigator,
  Animated,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import HtmlView from 'react-native-htmlview';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
// import Image from 'react-native-image-progress';
import Loader from '../components/Loader';
import PXTouchable from '../components/PXTouchable';
import FollowButton from '../components/FollowButton';
import PXImage from '../components/PXImage';
import PXImageTouchable from '../components/PXImageTouchable';
import PXThumbnail from '../components/PXThumbnail';
import PXThumbnailTouchable from '../components/PXThumbnailTouchable';
import Tags from '../components/Tags';
// import DetailTabBar from '../components/DetailTabBar';
import ImagesViewer from '../components/ImagesViewer';
import RelatedIllust from './RelatedIllust';
import IllustComment from './IllustComment';
const windowWidth = Dimensions.get('window').width; //full width
const windowHeight = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  infoContainer: {
    margin: 10,
    // backgroundColor: 'transparent',
    // position: 'absolute',
    // overflow: 'hidden',
    // bottom: 200,
    // left: 0
  },
  // commentContainer: {
  //   margin: 10
  // },
  sectionHeader: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  viewMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevronIcon: {
    marginLeft: 5,
  },
  header: {
    // paddingTop: 0,
    // top: 15,
    // right: 0,
    // left: 100,
    // position: 'absolute',
    ...Platform.select({
      ios: {
        top: 15
      },
    }),
    // right: 0,
    //left: 100,
    // position: 'absolute',
    alignItems: 'center'
  },
  thumnailNameContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  nameContainer: {
    flexDirection: 'column',
    marginLeft: 10
  },
  imageContainer: {
    width: Dimensions.get('window').width,
    //height: Dimensions.get('window').height - 150
  },
  captionContainer: {
    marginVertical: 10
  },
  imagePageNumberContainer: {
    top: 10,
    right: 10,
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: 'grey',
    borderRadius: 10,
    paddingHorizontal: 8,
    // height: 32,
  },
  imagePageNumber: {
    color: '#fff',
    padding: 2
  },
});

class Detail extends Component {
  static navigationOptions = {
    header: ({ state, setParams, goBack }, defaultHeader) => {
      const { item } = state.params;
      return {
        ...defaultHeader,
        title: (
          <View style={styles.thumnailNameContainer}>
            <PXThumbnailTouchable uri={item.user.profile_image_urls.medium} />
            <View style={styles.nameContainer}>
              <Text>{item.user.name}</Text>
              <Text>{item.user.account}</Text>
            </View>
          </View>
        ),
      }
    }
  }
  
  constructor(props) {
    // const { item } = props;
    super(props);
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    const { item } = this.props.navigation.state.params;
    let images;
    if (item.meta_pages && item.meta_pages.length) {
      images = item.meta_pages.map(image => {
        return {
          url: image.image_urls.original,
        }
      });
    }
    else {
      images = [{
        url: item.meta_single_page.original_image_url,
      }]
    }
    this.state = { 
      mounting: true,
      isInitState: true,
      images: images,
      viewerIndex: 0,
      showViewer: false,
    };
  }

  componentDidMount(){
    const { dispatch, product } = this.props;
    //may not working because component may not unmount on pop
    //dispatch(loadProduct({}, product));
    InteractionManager.runAfterInteractions(() => {
      this.setState({ mounting: false });
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  renderRow = (item, sectionId, rowId) => {
    const index = parseInt(rowId);
    const { item: baseItem } = this.props.navigation.state.params;
    const isLastRow = (baseItem.meta_pages.length - 1) == rowId;
    // console.log('render ', item.image_urls)
    // console.log('meta ', item.meta_single_page)
    // {item.image_urls.large}
    // "https://facebook.github.io/react/img/logo_og.png"
    //console.log("img ", item.image_urls.large)
    return (
      <PXImageTouchable 
        key={item.image_urls.large}
        uri={item.image_urls.large}
        initWidth={windowWidth}
        initHeight={200}
        style={{
          backgroundColor: '#E9EBEE',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: 'red',
        }}
        imageStyle={{
          resizeMode: "contain",
        }}
        onPress={() => this.handleOnPressImage(index)}
        onFoundImageSize={(width, height, url) => this.handleOnFoundImageSize(index, url)}
      />
    )
    //'https://facebook.github.io/react-native/img/header_logo.png'
  }

  renderFooter = () => {
    const { navigation } = this.props;
    const { item } = navigation.state.params;
    return (
      <View>
        <View style={styles.infoContainer}>
          <View style={styles.profileContainer}>
            <PXTouchable 
              style={styles.thumnailNameContainer}
              onPress={() => this.handleOnPressAvatar(item.user.id)}
            >
              <PXThumbnail uri={item.user.profile_image_urls.medium} />
              <View style={styles.nameContainer}>
                <Text>{item.user.name}</Text>
                <Text>{item.user.account}</Text>
              </View>
            </PXTouchable>
            <FollowButton isFollow={item.user.is_followed} />
          </View>
          <View style={styles.captionContainer}>
            <HtmlView 
              value={item.caption}
              onLinkPress={this.handleOnLinkPress}
            />
          </View>
          {
            <Tags tags={item.tags} onPressTag={this.handleOnPressTag} />
          }
        </View>
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Comments</Text>
            <PXTouchable onPress={this.handleOnPressViewMoreComments}>
              <View style={styles.viewMoreContainer}>
                <Text>View More</Text>
                <Icon name="chevron-right" style={styles.chevronIcon} />
              </View>
            </PXTouchable>
          </View>
          <IllustComment illustId={item.id} isFeatureInDetailPage={true} maxItems={6} navigation={navigation} />
        </View>
        {
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Related Works</Text>
              <PXTouchable onPress={this.handleOnPressViewMoreRelatedIllust}>
                <View style={styles.viewMoreContainer}>
                  <Text>View More</Text>
                  <Icon name="chevron-right" style={styles.chevronIcon} />
                </View>
              </PXTouchable>
            </View>
            <RelatedIllust illustId={item.id} isFeatureInDetailPage={true} maxItems={6} navigation={navigation} />
          </View>
        }
      </View>
    )
  }

  handleOnPressTag = (tag) => {
    const { navigate } = this.props.navigation;
    navigate('SearchResult', { word: tag });
    // Actions.searchResult({ word: tag });
  }

  handleOnPressAvatar = (userId) => {
    const { navigate } = this.props.navigation;
    navigate('UserDetail', { userId });
  }

  handleOnChangeVisibleRows = (visibleRows, changedRows) => {
    // not trigger on android
    // https://github.com/facebook/react-native/issues/5688
    // const { item } = this.props;
    const { item } = this.props.navigation.state.params;
    if (item.meta_pages && item.meta_pages.length && visibleRows.s1) {
      const visibleRowNumbers = Object.keys(visibleRows.s1).map((row) => parseInt(row));
      //console.log('visible row ', visibleRowNumbers)
      //Actions.refresh({ title: `${visibleRowNumbers[0] + 1} / ${item.meta_pages.length}`});
      this.setState({
        imagePageNumber: `${visibleRowNumbers[0] + 1} / ${item.meta_pages.length}`
      });
      if (visibleRowNumbers.length === 2) {
        // console.log('visible row ', visibleRowNumbers[0])
        // Actions.refresh({ title: `${visibleRowNumbers[0] + 1} of ${item.meta_pages.length}`});
          // visible row is visibleRowNumbers[0]
      }
      if (visibleRowNumbers.length === 3) {
          // visible row is visibleRowNumbers[1]
      }
    }
  }

  handleOnScroll = () => {
    const { isInitState, isScrolling } = this.state;
    if (isInitState) {
      this.setState({
        isInitState: false
      });
    }
    this.setState({
      isScrolling: true
    });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.setState({ isScrolling: false }), 500)
  }

  // handleOnEndReached = () => {
  //   console.log('end reached')
  //   // this.setState({
  //   //   endReached: true
  //   // });
  // }
  
  handleOnLinkPress = (url) => {
    console.log('clicked link: ', url)
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => {
      console.error('Error on link press ', err)
    });
  }

  handleOnFoundImageSize = (index, url) => {
    const { images } = this.state;
    var gg = {
      index,
      url
    }
    console.log('gg ', gg)
    this.setState({
      images: images.map((item, i) => {
        return index === i ? {
          ...item,
          cache: url
        }
        :
        item
      })
    })
  }

  handleOnPressImage = (index) => {
    console.log('aa')
    this.setState({
      viewerIndex: index,
      showViewer: true
    });
  }

  handleOnPressViewMoreComments = () => {
    const { navigate } = this.props.navigation;
    const { item } = this.props.navigation.state.params;
    console.log('navigate item ', item.id)
    navigate('IllustComment', {
      illustId: item.id,
      navigation: this.props.navigation
    });
  }

  handleOnPressViewMoreRelatedIllust = () => {
    const { navigate } = this.props.navigation;
    const { item } = this.props.navigation.state.params;
    console.log('navigate item ', item.id)
    navigate('RelatedIllust', {
      illustId: item.id,
      navigation: this.props.navigation
    });
  }

  render() {
    // const { item } = this.props;
    const { item } = this.props.navigation.state.params;
    const { mounting, imagePageNumber, isScrolling, isInitState, viewerIndex, showViewer, images } = this.state;
    const dataSource = this.dataSource.cloneWithRows(item.meta_pages);
    return (
      <View style={styles.container}>
        {
          mounting ?
          <Loader />
          :
          (item.meta_pages && item.meta_pages.length) ?
          <View>
            <Animatable.View style={{flex: 1}} ref="imageListContainer">
              <ListView
                ref="gv"
                dataSource={dataSource}
                renderRow={this.renderRow}
                renderFooter={this.renderFooter}
                enableEmptySections={ true }
                renderDistance={10}
                initialListSize={1}
                scrollRenderAheadDistance={300}
                onChangeVisibleRows={this.handleOnChangeVisibleRows}
                onEndReached={this.handleOnEndReached}
                onScroll={this.handleOnScroll}
              />
            </Animatable.View>
            {
              (isInitState || isScrolling) && imagePageNumber &&
              <View style={styles.imagePageNumberContainer}>
                <Text style={styles.imagePageNumber}>{imagePageNumber}</Text>
              </View>
            }
          </View>
          :
          <Animatable.View ref="imageListContainer">
            <ScrollView>
              <PXImageTouchable 
                uri={item.meta_single_page.original_image_url}    
                initWidth={item.width > windowWidth ? windowWidth : item.width}
                initHeight={windowWidth * item.height / item.width}
                style={{
                  backgroundColor: '#E9EBEE',
                }}
                imageStyle={{
                  resizeMode: "contain",
                }}
                onPress={() => this.handleOnPressImage(0)}
                onFoundImageSize={(width, height, url) => this.handleOnFoundImageSize(0, url)}
              />
              {this.renderFooter()}
            </ScrollView>
          </Animatable.View>
        }
        {
          showViewer &&
          <ImagesViewer items={images} viewerIndex={viewerIndex} />
        }
      </View>
    );
  }
}

export default Detail;
// scrollWithoutAnimation
// locked={true}
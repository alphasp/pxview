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
import ScrollableTabView from 'react-native-scrollable-tab-view';
import * as Animatable from 'react-native-animatable';
import PixivApi from 'pixiv-api-client';
// import Image from 'react-native-image-progress';
import Loader from '../components/Loader';
import PXTouchable from '../components/PXTouchable';
import FollowButton from '../components/FollowButton';
import PXImage from '../components/PXImage';
import PXImageTouchable from '../components/PXImageTouchable';
import PXThumbnail from '../components/PXThumbnail';
import PXThumbnailTouchable from '../components/PXThumbnailTouchable';
import Tags from '../components/Tags';
import DetailTabBar from '../components/DetailTabBar';
import ImagesViewer from '../components/ImagesViewer';
import RelatedIllust from './RelatedIllust';
import IllustComment from './IllustComment';
import { fetchRecommendedIllusts, fetchRecommendedIllustsPublic } from '../common/actions/recommendedIllust';
import { fetchRecommendedManga } from '../common/actions/recommendedManga';
const windowWidth = Dimensions.get('window').width; //full width
const windowHeight = Dimensions.get('window').height; //full height

const pixiv = new PixivApi();

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
  cardImage: {
    //resizeMode: 'contain',
    //margin: 5,
    //height: Dimensions.get('window').width / 2, //require for <Image />
    // width: 130,
  },
  imageContainer: {
    width: Dimensions.get('window').width,
    //height: Dimensions.get('window').height - 150
  },
  captionContainer: {
    marginVertical: 10
  },
  bottomTabs: {
    //flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    overflow: 'hidden',
    //top: 0,
    bottom: 0,
    left: 0,
    //right: 0,
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
  tabContainer: {
    flex: 1
  }
});

class Detail extends Component {
  constructor(props) {
    const { item } = props;
    super(props);
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
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
      bottomTabsPosition: "bottom",
      isInitState: true,
      fadeAnim: new Animated.Value(0),
      images: images,
      viewerIndex: 0,
      showViewer: false,
    };
  }
  componentWillMount(nextProps) {
    const { item } = this.props;
    Actions.refresh({ 
      renderTitle: () => {
        return (
          <View style={[styles.infoContainer, styles.header]}>
            <View style={styles.thumnailNameContainer}>
              <PXThumbnailTouchable uri={item.user.profile_image_urls.medium} />
              <View style={styles.nameContainer}>
                <Text>{item.user.name}</Text>
                <Text>{item.user.account}</Text>
              </View>
            </View>
          </View>
        )
      } 
    });
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
    const { item: baseItem } = this.props;
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

  renderInfo = () => {
    //2087.5 - 1999 = 88.5
    const { item } = this.props;
    const { selectedBottomTab, selectedBottomTabIndex, fadeAnim } = this.state;
    //console.log('render footer ', item)
    let footerStyle = {};
    // if (selectedBottomTab && selectedBottomTabIndex === 0) {
    //   //bottomTabNewStyle.height = windowHeight;
    //   footerStyle = {
    //     flex: 1,
    //     width: windowWidth
    //   }
    // }
    // else {
    //   footerStyle = {
    //     height: 0,
    //     width: 0
    //   }
    // }
    //console.log('fs ', footerStyle)
    return (
      <Animated.View style={{flex: 1, opacity: fadeAnim}}>
        <ScrollView>
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
              <FollowButton isFollow={false} />
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
        </ScrollView>
      </Animated.View>
    );
  }
  renderFooter = () => {
    return (
      <View style={{height: 300}} />
    )
  }
  renderComments = () => {
    const { item } = this.props;
    const { selectedBottomTab, fadeAnim } = this.state;
    return (
      <Animated.View style={{flex: 1, opacity: fadeAnim}}>
        <IllustComment illustId={item.id} />
      </Animated.View>
    );
  }

  handleOnPressTag = (tag) => {
    Actions.searchResult({ word: tag });
  }

  handleOnPressAvatar = (userId) => {
    Actions.userDetail({ userId });
  }

  handleOnChangeVisibleRows = (visibleRows, changedRows) => {
    // not trigger on android
    // https://github.com/facebook/react-native/issues/5688
    const { item } = this.props;
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
  handleOnChangeTab = ({i, ref}) => {
    const { selectedBottomTabIndex, selectedBottomTab, fadeAnim } = this.state;
    //console.log(i, selectedBottomTabIndex)
    if (i === selectedBottomTabIndex) {
      this.setState({
        selectedBottomTab: false,
        selectedBottomTabIndex: -1
      });
      this.refs.bottomTabs.transitionTo({ height: 45, backgroundColor: 'transparent' }, 300);
      InteractionManager.runAfterInteractions(() => {
        this.setState({ bottomTabsPosition: "bottom" });
      });
      if (this.refs.imageListContainer) {
        this.refs.imageListContainer.fadeIn();
      }
      Animated.timing(          // Uses easing functions
        fadeAnim,    // The value to drive
        { toValue: 0 }            // Configuration
      ).start(); 
    }
    else {
      const isSwitchingTab = selectedBottomTab;
      this.setState({
        selectedBottomTab: true,
        selectedBottomTabIndex: i
      });
      if (!isSwitchingTab) {
        // this.refs.bottomTabs.transitionTo({bottom: 300});
        const newHeight = Platform.OS == 'ios' ? windowHeight - Navigator.NavigationBar.Styles.General.TotalNavHeight : windowHeight - 76
        //const newHeight = windowHeight - Navigator.NavigationBar.Styles.General.TotalNavHeight;
        this.refs.bottomTabs.transitionTo({ height: newHeight, backgroundColor: '#fff'}, 300);    
        if (this.refs.imageListContainer) {
          this.refs.imageListContainer.slideOutUp();
        }
        this.setState({ bottomTabsPosition: "top" });
        Animated.timing(          // Uses easing functions
          fadeAnim,    // The value to drive
          { toValue: 1 }            // Configuration
        ).start(); 
      }
    }
  }

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

  render() {
    const { item } = this.props;
    const { mounting, selectedBottomTab, bottomTabsPosition, selectedBottomTabIndex, imagePageNumber, isScrolling, isInitState, fadeAnim, viewerIndex, showViewer, images } = this.state;
    const dataSource = this.dataSource.cloneWithRows(item.meta_pages);
    //let imageUrls = illust.meta_pages ?
    if (item.meta_pages && item.meta_pages.length){
      
    }
    else {
      // console.log('single img ', item.meta_single_page.original_image_url);
      // console.log('width ', item.width)
      // console.log('height ', item.height)
    }
    let bottomTabNewStyle = {};
    //console.log('selectedBottomTab ', selectedBottomTab)
    if (selectedBottomTab) {
      //bottomTabNewStyle.height = windowHeight;
      // bottomTabNewStyle = {
      //   //height: windowHeight,
      //   //position: 'relative'
      // }
      bottomTabNewStyle = {
        backgroundColor: '#fff'
      }
    }
    else {
      bottomTabNewStyle = {
        backgroundColor: 'transparent',
        //position: 'absolute',
      }
      // bottomTabNewStyle = { 
      //   backgroundColor: 'transparent',
      //   position: 'absolute',
      //   overflow: 'hidden',
      //   bottom: 0,
      //   left: 0
      // }
    }
    //console.log('bottomTabNewStyle ', bottomTabNewStyle)
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
              {/*
                this.renderFooter()
              */}
            </ScrollView>
          </Animatable.View>
        }
        {
          !mounting &&
          <Animatable.View style={[styles.bottomTabs, bottomTabNewStyle]} ref="bottomTabs">
            <ScrollableTabView 
              ref={(ref) => this.detailTabView = ref}
              tabBarPosition={bottomTabsPosition}
              onChangeTab={this.handleOnChangeTab}
              initialPage={-1}
              renderTabBar={(ref) => <DetailTabBar isShowActiveTabColor={selectedBottomTabIndex > -1} />}
            >
              <View tabLabel="ios-information-circle-outline" style={styles.tabContainer} >
                {this.renderInfo()}
              </View>
              <View tabLabel="ios-chatboxes-outline" style={styles.tabContainer}>
                {this.renderComments()}
              </View>
              <View tabLabel="ios-link-outline" style={styles.tabContainer}>
                {
                  <Animated.View style={{flex: 1, opacity: fadeAnim}}>
                    <RelatedIllust illustId={item.id} />
                  </Animated.View>
                }
              </View>
            </ScrollableTabView>
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
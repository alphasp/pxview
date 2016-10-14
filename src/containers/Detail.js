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
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import GridView from 'react-native-grid-view';
import HtmlView from 'react-native-htmlview';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import * as Animatable from 'react-native-animatable';
import PixivApi from 'pixiv-api-client';
// import Image from 'react-native-image-progress';
import Loader from '../components/Loader';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';
import PXImageTouchable from '../components/PXImageTouchable';
import PXThumbnail from '../components/PXThumbnail';
import Tags from '../components/Tags';
import RelatedIllust from './RelatedIllust';
import { fetchRecommendedIllust, fetchRecommendedIllustPublic } from '../common/actions/recommendedIllust';
import { fetchRecommendedManga } from '../common/actions/recommendedManga';
const windowWidth = Dimensions.get('window').width; //full width
const windowHeight = Dimensions.get('window').height; //full height

const pixiv = new PixivApi();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  infoContainer: {
    //flex: 1,
    margin: 10,
    // backgroundColor: 'transparent',
    // position: 'absolute',
    // overflow: 'hidden',
    // bottom: 200,
    // left: 0
  },
  thumnailNameContainer: {
    flexDirection: 'row'
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
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    overflow: 'hidden',
    //top: 0,
    bottom: 0,
    left: 0,
    //right: 0,
  }
});

class Detail extends Component {
  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })
    this.state = { 
      mounting: true,
      bottomTabsPosition: "bottom"
    };
  }
  // componentWillMount(nextProps) {
  //   const { item } = this.props;
  //   Actions.refresh({ title: item.title });
  // }

  componentDidMount(){
    const { dispatch, product } = this.props;
    //may not working because component may not unmount on pop
    //dispatch(loadProduct({}, product));
    InteractionManager.runAfterInteractions(() => {
      this.setState({ mounting: false });
    });
  }

  renderRow = (item, sectionId, rowId) => {
    const { item: baseItem } = this.props;
    const isLastRow = (baseItem.meta_pages.length - 1) == rowId;
    // console.log('render ', item.image_urls)
    // console.log('meta ', item.meta_single_page)
    // {item.image_urls.large}
    // "https://facebook.github.io/react/img/logo_og.png"
    //console.log("img ", item.image_urls.large)
    return (
      <PXImageTouchable 
        key={item.image_urls.original}
        uri={item.image_urls.original}
        initWidth={windowWidth}
        initHeight={200}
        style={{
          backgroundColor: '#E9EBEE',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: 'red'
        }}
        imageStyle={{
          resizeMode: "contain",
        }}
        onFoundImageSize={isLastRow ? this.onFoundImageSize : null}
      />
    )
    //'https://facebook.github.io/react-native/img/header_logo.png'
  }

  renderFooter = () => {
    //2087.5 - 1999 = 88.5
    const { item } = this.props;
    const { selectedBottomTab, selectedBottomTabIndex } = this.state;
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
    console.log('fs ', footerStyle)
    return (
      selectedBottomTab &&
      <View style={footerStyle}>
        <View style={styles.infoContainer}>
          <View style={styles.thumnailNameContainer}>
            <PXTouchable style={{ width: 30, height: 30 }}>
              <PXThumbnail 
                uri={item.user.profile_image_urls.medium}
              />
            </PXTouchable>
            <View style={styles.nameContainer}>
              <Text>{item.user.name}</Text>
              <Text>{item.user.account}</Text>
            </View>
          </View>
          <View style={styles.captionContainer}>
            <HtmlView 
              value={item.caption}
            />
          </View>
          {
            <Tags tags={item.tags} />
          }
        </View>
      </View>
    );
  }
  renderFooter2 = () => {
    return (
      <View style={{height: 300}} />
    )
  }
  renderTempMore = () => {
    const { selectedBottomTab } = this.state;
    let footerStyle = {};
    // if (selectedBottomTab) {
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
    // console.log('temp ', footerStyle)
    console.log('sbt ', selectedBottomTab)
    return (
      selectedBottomTab &&
      <View>
        <Text>aaa</Text>
      </View>
    )
  }

  handleOnChangeVisibleRows= (visibleRows, changedRows) => {
    // Called when the set of visible rows changes. visibleRows maps { sectionID: { rowID: true }} for all the visible rows, and changedRows maps { sectionID: { rowID: true | false }} for the rows that have changed their visibility, with true indicating visible, and false indicating the view has moved out of view.
    const { item } = this.props;
    if (item.meta_pages && item.meta_pages.length && visibleRows.s1) {
      const visibleRowNumbers = Object.keys(visibleRows.s1).map((row) => parseInt(row));
      console.log('visible row ', visibleRowNumbers)
      Actions.refresh({ title: `${visibleRowNumbers[0] + 1} / ${item.meta_pages.length}`});
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
  // handleOnEndReached = () => {
  //   console.log('end reached')
  //   // this.setState({
  //   //   endReached: true
  //   // });
  // }
  handleOnChangeTab = ({i, ref}) => {
    const { selectedBottomTabIndex } = this.state;
    //console.log(i, selectedBottomTabIndex)
    if (i === selectedBottomTabIndex) {
      this.setState({
        selectedBottomTab: false,
        selectedBottomTabIndex: -1
      });
      this.refs.bottomTabs.transitionTo({ height: 60, backgroundColor: 'transparent' }, 300);
      InteractionManager.runAfterInteractions(() => {
        this.setState({ bottomTabsPosition: "bottom" });
      });
      if (this.refs.imageListContainer) {
        this.refs.imageListContainer.fadeIn();
      }
    }
    else {
      this.setState({
        selectedBottomTab: true,
        selectedBottomTabIndex: i
      });
      // this.refs.bottomTabs.transitionTo({bottom: 300});
      this.refs.bottomTabs.transitionTo({ height: windowHeight - 64, backgroundColor: '#fff'}, 300);    
      if (this.refs.imageListContainer) {
        this.refs.imageListContainer.slideOutUp();
      }
      this.setState({ bottomTabsPosition: "top" });
    }
  }

  render() {
    const { item } = this.props;
    const { mounting, selectedBottomTab, bottomTabsPosition } = this.state;
    const dataSource = this.dataSource.cloneWithRows(item.meta_pages);
    //let imageUrls = illust.meta_pages ?
    if (item.meta_pages && item.meta_pages.length){
      
    }
    else {
      console.log('single img ', item.meta_single_page.original_image_url);
      console.log('width ', item.width)
      console.log('height ', item.height)
    }
    let bottomTabNewStyle = {};
    console.log('selectedBottomTab ', selectedBottomTab)
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
    console.log('bottomTabNewStyle ', bottomTabNewStyle)
    return (
      <View style={styles.container}>
        {
          mounting ?
          null
          :
          (item.meta_pages && item.meta_pages.length) ?
          <Animatable.View style={{flex: 1}} ref="imageListContainer">
            <ListView
              ref="gv"
              dataSource={dataSource}
              renderRow={this.renderRow}
              renderFooter={this.renderFooter2}
              enableEmptySections={ true }
              renderDistance={10}
              initialListSize={1}
              scrollRenderAheadDistance={300}
              onChangeVisibleRows={this.handleOnChangeVisibleRows}
              onContentSizeChange={(contentWidth, contentHeight) => console.log(contentWidth, contentHeight)}
              onEndReached={this.handleOnEndReached}
              onScroll={this.handleOnScroll}
            />
          </Animatable.View>
          :
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
            />
            {/*
              this.renderFooter()
            */}
          </ScrollView>
        }
        {
          !mounting &&
          <Animatable.View style={[styles.bottomTabs, bottomTabNewStyle]} ref="bottomTabs">
            <ScrollableTabView 
              tabBarPosition={bottomTabsPosition}
              scrollWithoutAnimation
              onChangeTab={this.handleOnChangeTab}
            >
              <View tabLabel="Info">
                {this.renderFooter()}
              </View>
              <View tabLabel="More">
                {this.renderTempMore()}
              </View>
              <View tabLabel="Related Illustrations" style={{flex: 1}}>
                {
                  selectedBottomTab &&
                  <RelatedIllust illustId={item.id} />
                }
              </View>
            </ScrollableTabView>
          </Animatable.View>
        }
      </View>
    );
                //     <PXImage 
                //   uri={item.user.profile_image_urls.medium}   
                //   style={{
                //     resizeMode: "cover",
                //   }} 
                // />
    // <Image 
    //   source={{ 
    //     uri: "https://facebook.github.io/react/img/logo_og.png"
    //   }}
    //   style={{
    //     resizeMode: "cover",
    //     width: 30,
    //     height: 30
    //   }} 
    // />
      // "user": {
      //   "id": 1081538,
      //   "name": "いな◆紅楼夢 D-01b",
      //   "account": "inadahime",
      //   "profile_image_urls": {
      //     "medium": "https://i2.pixiv.net/user-profile/img/2016/01/17/12/18/16/10394853_be859b3749c80617a0164279a4479551_170.png"
      //   },
      //   "is_followed": false
      // },
          //     <PXImageTouchable 
          //   uri={item.meta_single_page.original_image_url}    
          //   initWidth={item.width > windowWidth ? windowWidth : item.width}
          //   initHeight={windowWidth * item.height / item.width}
          //   style={{
          //     backgroundColor: '#E9EBEE',
          //   }}
          //   imageStyle={{
          //     resizeMode: "contain",
          //   }}
          // />
          //     <PXTouchable 
          //   style={{ 
          //     width: item.width > windowWidth ? windowWidth : item.width,
          //     height: windowWidth * item.height / item.width,
          //     backgroundColor: '#E9EBEE',
          //   }}
          // >
          //   <PXImage 
          //     uri={item.meta_single_page.original_image_url}    
          //     resizeMode={Image.resizeMode.contain}
          //     style={{
          //       resizeMode: "contain"
          //     }}
          //   />
          // </PXTouchable>
    //'https://i1.pixiv.net/img-original/img/2016/01/01/14/12/45/54449988_p0.jpg'
          //     <PXTouchable 
          //   style={{ 
          //     backgroundColor: '#E9EBEE',
          //     width: width,
          //     height: item.height > height ? height : item.height
          //   }} 
          // >
          //   <PXImage 
          //     source={item.meta_single_page.original_image_url}
          //     resizeMode={Image.resizeMode.contain}
          //     style={[ styles.cardImage, {
          //       flex: 1,
          //     } ]}
          //   />
          // </PXTouchable>
          // <View style={styles.imageContainer}>
          //   <PXImage 
          //     source={item.meta_single_page.original_image_url}
          //     style={[ styles.cardImage, {
          //       flex: 1,
          //     } ]}
          //   />
          // </View>
  }
}

export default Detail;
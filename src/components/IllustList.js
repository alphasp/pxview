import React, { Component, PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  ListView,
  RecyclerViewBackedScrollView,
  RefreshControl,
  FlatList
} from 'react-native';
// import FlatList from 'react-native/Libraries/Experimental/FlatList';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { Actions } from 'react-native-router-flux';
//import GridView from 'react-native-grid-view';
// import Image from 'react-native-image-progress';
import GridView from './GridView';
import Loader from './Loader';
import PXTouchable from './PXTouchable';
import PXImage from './PXImage';
import OverlayImagePages from './OverlayImagePages';
import OverlayBookmarkButtonContainer from '../containers/OverlayBookmarkButtonContainer';
import BookmarkModal from '../containers/BookmarkModal';
import * as bookmarkIllustActionCreators from '../common/actions/bookmarkIllust';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  cardImage: {
    resizeMode: 'cover',
    //margin: 5,
    height: Dimensions.get('window').width / 3, //require for <Image />
    // width: 130,
  },
});

/*class IllustItem extends PureComponent {
  render() {
    const { item, onPressItem, onPressLikeButton, onLongPressLikeButton } = this.props;
    return (
      <PXTouchable 
        style={{ 
          margin: 1,
          backgroundColor: '#E9EBEE',
          width: width / 3 - 2, 
          height: width / 3 - 2,
        }} 
        key={item.id} 
        onPress={onPressItem}
      >
        <PXImage 
          uri={item.image_urls.square_medium}
          style={[ styles.cardImage, {
            width: width / 3 - 2, 
            height: width / 3 - 2,
          }]}
        />
        {
          (item.meta_pages && item.meta_pages.length) ?
          <OverlayImagePages total={item.meta_pages.length} />
          :
          null
        }
        <OverlayBookmarkButton 
          isBookmark={item.is_bookmarked} 
          onPress={onPressLikeButton} 
          onLongPress={onLongPressLikeButton}
        />
      </PXTouchable>
    );
  }
}*/

class IllustList extends Component {
  constructor(props) {
    super(props);
    const { data: { items }, maxItems } = props;
    // const dataSource = new ListView.DataSource({
    //   rowHasChanged: (r1, r2) => r1 !== r2,
    // });
    // this.state = {
    //   dataSource: (items && items.length) ? dataSource.cloneWithRows(maxItems ? items.slice(0, maxItems) : items) : dataSource,
    // };
  }

  // componentWillReceiveProps(nextProps) {
  //   const { data: { items: prevItems } } = this.props;
  //   const { data: { items }, maxItems } = nextProps;
  //   if (items && items !== prevItems) {
  //     const { dataSource } = this.state;
  //     this.setState({
  //       dataSource: dataSource.cloneWithRows(maxItems ? items.slice(0, maxItems) : items)
  //     });
  //   }
  // }
  
  renderRow = ({ item }) => {
    return (
      /*<IllustItem 
        item={item} 
        onPressItem={() => this.handleOnPressItem(item)}
        onPressLikeButton={() => this.handleOnPressLikeButton(item)} 
        onLongPressLikeButton={() => this.handleOnLongPressLikeButton(item)}
      />*/
      <PXTouchable 
        style={{ 
          margin: 1,
          backgroundColor: '#E9EBEE',
          width: width / 3 - 2, 
          height: width / 3 - 2,
        }} 
        key={item.id} 
        onPress={() => this.handleOnPressItem(item)}
      >
        <PXImage 
          uri={item.image_urls.square_medium}
          style={[ styles.cardImage, {
            width: width / 3 - 2, 
            height: width / 3 - 2,
          }]}
        />
        {
          (item.meta_pages && item.meta_pages.length) ?
          <OverlayImagePages total={item.meta_pages.length} />
          :
          null
        }
        <OverlayBookmarkButtonContainer item={item} />
      </PXTouchable>
    );
  }

  renderFooter = () => {
    const { data: { nextUrl, loading } } = this.props;
    return (
      (nextUrl && loading) ?
      <View style={{ 
        width: width,
        marginBottom: 20
      }}>
        <Loader verticalCenter={false} />
      </View>
      :
      null
    )
  }

  handleOnPressItem = (item) => {
    const { navigate } = this.props.navigation;
    navigate('Detail', { item });
  }

  render() {
    const { data: { items, loading, loaded }, refreshing, onRefresh, loadMoreItems, onScroll, maxItems } = this.props;
    // const { dataSource } = this.state;
    return (
      <View style={styles.container}>
        {
          (!items || (!loaded && loading)) &&
          <Loader />
        }
        {/*{
          (items && items.length) ?
          <GridView 
            dataSource={dataSource}
            renderRow={this.renderRow}
            pageSize={30}
            onEndReachedThreshold={30}
            onEndReached={loadMoreItems}
            renderFooter={this.renderFooter}
            enableEmptySections={true}
            onScroll={onScroll}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />
          :
          null
        }*/}
        {
          (items && items.length) ?
          <FlatList
            data={maxItems ? items.slice(0, maxItems) : items}
            numColumns={3}
            keyExtractor={(item, index) => item.id}
            renderItem={this.renderRow}
            getItemLayout={(data, index, horizontal) => {
              return {
                length: Dimensions.get('window').width / 3,
                offset: (Dimensions.get('window').width / 3) * index, 
                index
              };
            }}
            shouldItemUpdate={(prev, next) => {
              //console.log(prev.item.is_bookmarked !== next.item.is_bookmarked, prev.item, next.item, prev.index, next.index)
              return (prev.item.is_bookmarked !== next.item.is_bookmarked) || (prev.item.user.is_followed !== next.item.user.is_followed)
            }}
            legacyImplementation={false}
            debug={false}
            disableVirtualization={false}
            onEndReachedThreshold={0}
            onEndReached={loadMoreItems}
            FooterComponent={this.renderFooter}
            onScroll={onScroll}
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

export default withNavigation(connect(null, bookmarkIllustActionCreators)(IllustList));
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  ListView,
  RecyclerViewBackedScrollView,
  RefreshControl,
} from 'react-native';
import FlatList from 'react-native/Libraries/Experimental/FlatList';
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
import OverlayLikeButton from './OverlayLikeButton';
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

class IllustList extends Component {
  constructor(props) {
    super(props);
    const { data: { items }, maxItems } = props;
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: (items && items.length) ? dataSource.cloneWithRows(maxItems ? items.slice(0, maxItems) : items) : dataSource,
      isOpenBookmarkModal: false,
      selectedIllustId: null,
      isBookmark: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data: { items: prevItems } } = this.props;
    const { data: { items }, maxItems } = nextProps;
    if (items && items !== prevItems) {
      const { dataSource } = this.state;
      this.setState({
        dataSource: dataSource.cloneWithRows(maxItems ? items.slice(0, maxItems) : items)
      });
    }
  }
  
  renderRow = ({ item }) => {
    const { onPressLikeButton } = this.props;
    return (
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
        <OverlayLikeButton 
          isLike={item.is_bookmarked} 
          onPress={() => this.handleOnPressLikeButton(item)} 
          onLongPress={() => this.handleOnLongPressLikeButton(item)}
        />
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

  handleOnPressLikeButton = (item) => {
    const { bookmarkIllust, unbookmarkIllust } = this.props;
    if (item.is_bookmarked) {
      unbookmarkIllust(item.id);
    }
    else {
      bookmarkIllust(item.id);
    }
    // console.log(this.props);
    // console.log('on press ', item.id, item.title);
  }

  handleOnLongPressLikeButton = (item) => {
    this.setState({
      isOpenBookmarkModal: true,
      selectedIllustId: item.id,
      isBookmark: item.is_bookmarked,
    })
  }

  handleOnPressCloseBookmarkModalButton = () => {
    this.setState({
      isOpenBookmarkModal: false,
      selectedIllustId: null,
      isBookmark: false,
    })
  }

  handleOnPressModalLikeButton = (illustId, bookmarkType, selectedTags) => {
    const { bookmarkIllust, unbookmarkIllust } = this.props;
    bookmarkIllust(illustId, bookmarkType, selectedTags);
    this.handleOnPressCloseBookmarkModalButton();
  }

  handleOnPressModalRemoveButton = (illustId) => {
    const { bookmarkIllust, unbookmarkIllust } = this.props;
    unbookmarkIllust(illustId);
    this.handleOnPressCloseBookmarkModalButton();
  }

  render() {
    const { data: { items, loading, loaded }, refreshing, onRefresh, loadMoreItems, onScroll } = this.props;
    const { dataSource, isOpenBookmarkModal, selectedIllustId, isBookmark } = this.state;
    return (
      <View style={styles.container}>
        {
          !loaded && loading &&
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
            data={items}
            numColumns={3}
            keyExtractor={(item, index) => item.id}
            ItemComponent={this.renderRow}
            pageSize={30}
            onEndReachedThreshold={30}
            onEndReached={loadMoreItems}
            FooterComponent={this.renderFooter}
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
        }
        {
          isOpenBookmarkModal && selectedIllustId &&
          <BookmarkModal 
            illustId={selectedIllustId}
            isBookmark={isBookmark}
            onPressLikeButton={this.handleOnPressModalLikeButton}
            onPressRemoveButton={this.handleOnPressModalRemoveButton}
            onPressCloseButton={this.handleOnPressCloseBookmarkModalButton}
          />
        }
      </View>
    );
  }
}

export default withNavigation(connect(null, bookmarkIllustActionCreators)(IllustList));
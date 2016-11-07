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
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
//import GridView from 'react-native-grid-view';
// import Image from 'react-native-image-progress';
import GridView from '../components/GridView';
import Loader from '../components/Loader';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';
import OverlayImagePages from '../components/OverlayImagePages';
import { fetchRecommendedIllusts, fetchRecommendedIllustsPublic } from '../common/actions/recommendedIllust';
import { fetchRecommendedManga } from '../common/actions/recommendedManga';
import Spinner from 'react-native-spinkit';

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
    height: Dimensions.get('window').width / 2, //require for <Image />
    // width: 130,
  },
});

class Recommended extends Component {
  constructor(props) {
    super(props);
    const { items } = props;
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      })
    };
  }
  componentWillReceiveProps(nextProps) {
    const { recommended: { items: prevItems } } = this.props;
    const { recommended: { items } } = nextProps;
    if (items && items !== prevItems) {
      const { dataSource } = this.state;
      this.setState({
        dataSource: dataSource.cloneWithRows(items)
      });
    }
  }
  renderRow = (item) => {
    // console.log('render ', item.image_urls)
    // console.log('meta ', item.meta_single_page)
    // {item.image_urls.large}
    // "https://facebook.github.io/react/img/logo_og.png"
    //console.log("img ", item.image_urls.large)
    // return (
    //           <PXImage 
    //       uri={item.image_urls.square_medium}
    //       style={[ styles.cardImage, {
    //         width: width / 2 - 2, 
    //         height: width / 2 - 2,
    //       }]}
    //     />
    // )
    return (
      <PXTouchable 
        style={{ 
          margin: 1,
          backgroundColor: '#E9EBEE',
          width: width / 2 - 2, 
          height: width / 2 - 2,
        }} 
        key={ item.id } 
        onPress={ () => this.handleOnPressItem(item) }
      >
        <PXImage 
          uri={item.image_urls.square_medium}
          style={[ styles.cardImage, {
            width: width / 2 - 2, 
            height: width / 2 - 2,
          }]}
        />
        {
          (item.meta_pages && item.meta_pages.length) ?
          <OverlayImagePages total={item.meta_pages.length} />
          :
          null
        }
      </PXTouchable>
    );
  }

  renderFooter = () => {
    const { recommended: { nextUrl } } = this.props;
    //const { nextUrl } = this.state;
    return (
      nextUrl ?
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
    Actions.detail({ item: item });
  }
  render() {
    const { recommended: { items, loading, loaded }, refreshing, onRefresh, loadMoreItems } = this.props;
    const { dataSource } = this.state;
    return (
      <View style={styles.container}>
        {
          !loaded && loading &&
          <Loader />
        }
        {
          (items && items.length) ?
          <GridView 
            dataSource={dataSource}
            renderRow={this.renderRow}
            onEndReachedThreshold={ 30 }
            onEndReached={ loadMoreItems }
            renderFooter={ this.renderFooter }
            enableEmptySections={ true }
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
        {/*
          (items && items.length) ?
          <GridView
            items={ items }
            itemsPerRow={ 2 }
            renderItem={ this.renderItem }
            onEndReachedThreshold={ 30 }
            onEndReached={ loadMoreItems }
            renderFooter={ this.renderFooter }
            enableEmptySections={ true }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />
          :
          null
        */}
      </View>
    );
  }
}

export default Recommended;
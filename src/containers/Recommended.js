import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  RecyclerViewBackedScrollView,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import GridView from 'react-native-grid-view';
import PixivApi from 'pixiv-api-client';
// import Image from 'react-native-image-progress';
import Loader from '../components/Loader';
import PixivImage from '../components/PixivImage';
import { fetchRecommendedIllust, fetchRecommendedIllustPublic } from '../common/actions/recommendedIllust';
import { fetchRecommendedManga } from '../common/actions/recommendedManga';

const pixiv = new PixivApi();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  cardImage: {
    resizeMode: 'cover',
    //margin: 5,
    height: Dimensions.get('window').width / 2, //require for <Image />
    // width: 130,
  },
});

class Recommended extends Component {
  renderItem = (item) => {
    // console.log('render ', item.image_urls)
    // console.log('meta ', item.meta_single_page)
    // {item.image_urls.large}
    // "https://facebook.github.io/react/img/logo_og.png"
    //console.log("img ", item.image_urls.large)
    var width = Dimensions.get('window').width; //full width
    var height = Dimensions.get('window').height; //full height
    return (
      <View key={item.id} style={{ 
        margin: 5,
        backgroundColor: '#E9EBEE',
        width: width / 2 - 10, 
        height: width / 2 - 10,
      }}>
        <PixivImage 
          source={item.image_urls.square_medium}
          style={ styles.cardImage }
          initHeight={ width / 2 }
        />
      </View>
    );
  }

  renderFooter = () => {
    const { recommended: { nextUrl } } = this.props;
    //const { nextUrl } = this.state;
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
    const { recommended: { items, loading, loaded }, refreshing, onRefresh, loadMoreItems } = this.props;
    return (
      <View style={styles.container}>
        {
          !loaded && loading &&
           <Loader />
        }
        {
          (items && items.length) ?
          <GridView
            items={ items }
            itemsPerRow={ 2 }
            renderItem={ this.renderItem }
            renderScrollComponent={ props => <RecyclerViewBackedScrollView {...props} />}
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
      </View>
    );
  }
}

export default Recommended;
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
//import GridView from 'react-native-grid-view';
// import Image from 'react-native-image-progress';
import GridView from '../components/GridView';
import Loader from '../components/Loader';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';
import { fetchTrendingIllustTags, clearTrendingIllustTags } from '../common/actions/trendingIllustTag';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
  // outerContainer: {
  //   position: 'absolute',
  //   backgroundColor: 'rgba(0, 0, 0, 0.3)',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  // },
  tagContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: windowWidth / 3 - 3,
    //flex: 1,
    //backgroundColor: 'transparent',
    //position: 'absolute',
    //alignItems: 'flex-end',
    //flex: 1,
    //alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10
  },
  tag: {
    //flex: 1,
    backgroundColor: 'transparent',
    color: '#fff',
    //position: 'absolute',
    //alignSelf: 'center',
    //fontWeight: 'bold',
    textAlign: 'center',
    //flexWrap: 'wrap'
    //bottom: 30,
  }
});

class TrendingIllustTag extends Component {
  constructor(props) {
    super(props);
    const { items } = props;
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch } = this.props; 
    dispatch(fetchTrendingIllustTags()).then(() => {
      const { trendingIllustTag: { items } } = this.props;
      const { dataSource } = this.state;
      this.setState({
        dataSource: dataSource.cloneWithRows(items)
      });
    });
  }

  renderRow = (item) => {
    return (
      <PXTouchable 
        style={{ 
          margin: 1,
          backgroundColor: '#E9EBEE',
          width: windowWidth / 3 - 3, 
          height: windowWidth / 3 - 3,
        }} 
        key={ item.tag } 
        onPress={ () => this.handleOnPressItem(item) }
      >
        <View>
          <PXImage 
            uri={item.illust.image_urls.square_medium}
            style={[styles.cardImage, {
              width: windowWidth / 3 - 3, 
              height: windowWidth / 3 - 3,
            }]}
            onFoundImageSize={this.handleOnFoundImageSize}
          />
          <View style={[styles.tagContainer, {
            width: windowWidth / 3 - 3, 
          }]}>
            <Text style={styles.tag}>{ item.tag }</Text>
          </View>
        </View>
      </PXTouchable>
    );
  }
  
  handleOnRefresh = () => {
    const { dispatch } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearTrendingIllustTags());
    dispatch(fetchTrendingIllustTags()).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  handleOnPressItem = (item) => {
    const { navigate } = this.props.navigation;
    navigate('SearchResult', { word: item.tag });
  }
  render() {
    const { trendingIllustTag: { items, loading, loaded } } = this.props;
    const { dataSource, refreshing } = this.state;
    //not working for android
    // renderScrollComponent={ props => <RecyclerViewBackedScrollView {...props} />}

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
            enableEmptySections={true}
            initialListSize={30}
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

export default connect((state, props) => {
  return {
    trendingIllustTag: state.trendingIllustTag,
  }
})(TrendingIllustTag);
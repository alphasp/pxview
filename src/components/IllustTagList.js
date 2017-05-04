import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  RefreshControl,
  FlatList,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import Loader from './Loader';
import PXTouchable from './PXTouchable';
import PXImage from './PXImage';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardImage: {
    resizeMode: 'cover',
    // margin: 5,
    height: Dimensions.get('window').width / 3, //require for <Image />
    // width: 130,
  },
  tagContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: windowWidth / 3 - 3,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  tag: {
    // flex: 1,
    backgroundColor: 'transparent',
    color: '#fff',
    // position: 'absolute',
    // alignSelf: 'center',
    // fontWeight: 'bold',
    textAlign: 'center',
    //flexWrap: 'wrap'
    //bottom: 30,
  },
});

class IllustTagList extends Component {
  renderItem = ({ item }) => (
    <PXTouchable
      style={{
        margin: 1,
        backgroundColor: '#E9EBEE',
        width: windowWidth / 3 - 3,
        height: windowWidth / 3 - 3,
      }}
      key={item.tag}
      onPress={() => this.handleOnPressItem(item)}
    >
      <View>
        <PXImage
          uri={item.illust.image_urls.square_medium}
          style={[
            styles.cardImage,
            {
              width: windowWidth / 3 - 3,
              height: windowWidth / 3 - 3,
            },
          ]}
        />
        <View
          style={[
            styles.tagContainer,
            {
              width: windowWidth / 3 - 3,
            },
          ]}
        >
          <Text style={styles.tag}>{item.tag}</Text>
        </View>
      </View>
    </PXTouchable>
  );

  handleOnPressItem = item => {
    const { navigate } = this.props.navigation;
    navigate('SearchResult', { word: item.tag });
  };

  render() {
    const {
      data: { items, loading, loaded, refreshing },
      onRefresh,
    } = this.props;
    // const { dataSource } = this.state;
    return (
      <View style={styles.container}>
        {(!items || (!loaded && loading)) && <Loader />}
        {items && items.length
          ? <FlatList
              data={items}
              numColumns={3}
              keyExtractor={item => item.tag}
              renderItem={this.renderItem}
              getItemLayout={(data, index) => ({
                length: Dimensions.get('window').width / 3,
                offset: Dimensions.get('window').width / 3 * index,
                index,
              })}
              removeClippedSubviews={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          : null}
      </View>
    );
  }
}

export default withNavigation(IllustTagList);

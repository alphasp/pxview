import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  RefreshControl,
  FlatList,
  Platform,
} from 'react-native';
// import FlatList from 'react-native/Libraries/Experimental/FlatList';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
// import GridView from 'react-native-grid-view';
// import Image from 'react-native-image-progress';
import IllustItem from './IllustItem';
import Loader from './Loader';
import * as bookmarkIllustActionCreators
  from '../common/actions/bookmarkIllust';

const width = Dimensions.get('window').width; // full width

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class IllustList extends Component {
  renderItem = ({ item }) => (
    <IllustItem item={item} onPressItem={() => this.handleOnPressItem(item)} />
  );

  renderFooter = () => {
    const { data: { nextUrl, loading } } = this.props;
    return nextUrl && loading
      ? <View
          style={{
            width,
            marginBottom: 20,
          }}
        >
          <Loader verticalCenter={false} />
        </View>
      : null;
  };

  handleOnPressItem = item => {
    const { navigate } = this.props.navigation;
    navigate('Detail', { item });
  };

  render() {
    const {
      data: { items, loading, loaded, refreshing },
      onRefresh,
      loadMoreItems,
      onScroll,
      maxItems,
    } = this.props;
    // const { dataSource } = this.state;
    // console.log('render illust list ', this.props.data)
    return (
      <View style={styles.container}>
        {(!items || (!loaded && loading)) && <Loader />}
        {/* {
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
        {loaded
          ? <FlatList
              data={maxItems ? items.slice(0, maxItems) : items}
              numColumns={3}
              keyExtractor={item => item.id}
              renderItem={this.renderItem}
              getItemLayout={(data, index) => ({
                length: Dimensions.get('window').width / 3,
                offset: Dimensions.get('window').width / 3 * index,
                index,
              })}
              legacyImplementation={false}
              debug={false}
              disableVirtualization={false}
              removeClippedSubviews={Platform.OS === 'android'}
              initialNumToRender={5}
              onEndReachedThreshold={0.1}
              onEndReached={loadMoreItems}
              ListFooterComponent={this.renderFooter}
              onScroll={onScroll}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          : null}
      </View>
    );
  }
}

export default withNavigation(
  connect(null, bookmarkIllustActionCreators)(IllustList),
);

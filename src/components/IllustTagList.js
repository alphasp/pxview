import React, { Component } from 'react';
import { StyleSheet, Text, View, RefreshControl, FlatList } from 'react-native';
import { withNavigation } from 'react-navigation';
import Loader from './Loader';
import PXTouchable from './PXTouchable';
import PXImage from './PXImage';
import { globalStyles, globalStyleVariables } from '../styles';

const ILLUST_COLUMNS = 3;

const styles = StyleSheet.create({
  tagContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: globalStyleVariables.WINDOW_WIDTH / 3 - 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
    width: globalStyleVariables.WINDOW_WIDTH / 3 - 1,
  },
  tag: {
    backgroundColor: 'transparent',
    color: '#fff',
    textAlign: 'center',
  },
});

class IllustTagList extends Component {
  renderItem = ({ item, index }) => (
    <PXTouchable
      style={{
        marginRight: index % ILLUST_COLUMNS < ILLUST_COLUMNS - 1 ? 1 : 0,
        marginBottom: 1,
        backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
        flexGrow: 1,
      }}
      key={item.tag}
      onPress={() => this.handleOnPressItem(item)}
    >
      <View>
        <PXImage
          uri={item.illust.image_urls.square_medium}
          style={{
            height: globalStyleVariables.WINDOW_WIDTH / ILLUST_COLUMNS,
            resizeMode: 'cover',
          }}
        />
        <View style={styles.tagContainer}>
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
    return (
      <View style={globalStyles.container}>
        {(!items || (!loaded && loading)) && <Loader />}
        {items && items.length
          ? <FlatList
              data={items}
              numColumns={ILLUST_COLUMNS}
              keyExtractor={item => item.tag}
              renderItem={this.renderItem}
              getItemLayout={(data, index) => ({
                length: globalStyleVariables.WINDOW_WIDTH / ILLUST_COLUMNS,
                offset: globalStyleVariables.WINDOW_WIDTH /
                  ILLUST_COLUMNS *
                  index,
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

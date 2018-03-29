import React, { Component } from 'react';
import { View, Platform, ViewPagerAndroid, FlatList } from 'react-native';
import Loader from './Loader';
import { globalStyles, globalStyleVariables } from '../styles';

const LIST_WINDOW_SIZE = 5;

class PXViewPager extends Component {
  handleOnIOSViewPagerPageSelected = e => {
    const { onPageSelected } = this.props;
    const contentOffset = e.nativeEvent.contentOffset;
    const viewSize = e.nativeEvent.layoutMeasurement;
    // Divide the horizontal offset by the width of the view to see which page is visible
    const index = Math.round(contentOffset.x / viewSize.width);
    if (index > -1) {
      onPageSelected(index);
    }
  };

  handleOnAndroidViewPagerPageSelected = e => {
    const { items, onEndReached } = this.props;
    // const { position } = e.nativeEvent;
    const { onPageSelected } = this.props;
    const index = e.nativeEvent.position;
    onPageSelected(index);
    if (onEndReached && index >= items.length - 2) {
      onEndReached();
    }
  };

  renderContentForAndroid = () => {
    const { items, keyExtractor, renderContent, index } = this.props;
    // console.log('renderContentForAndroid ', items);
    const size = Math.floor(LIST_WINDOW_SIZE / 2);
    return items.map((item, i) => {
      if (i >= index - size && i <= index + size) {
        return renderContent({ item, index: i });
      }
      const key = keyExtractor(item, i);
      console.log('key ', key);
      return (
        <View key={key}>
          <Loader />
        </View>
      );
    });
  };

  render() {
    const {
      items,
      index,
      keyExtractor,
      renderContent,
      onEndReached,
      viewPagerRef,
    } = this.props;
    if (Platform.OS === 'android') {
      return (
        <ViewPagerAndroid
          ref={viewPagerRef}
          key={`pxViewPager-${items.length}`} // https://github.com/facebook/react-native/issues/4775
          initialPage={index}
          style={globalStyles.container}
          onPageSelected={this.handleOnAndroidViewPagerPageSelected}
        >
          {this.renderContentForAndroid()}
        </ViewPagerAndroid>
      );
    }
    return (
      <FlatList
        ref={viewPagerRef}
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderContent}
        scrollEventThrottle={16}
        onMomentumScrollEnd={this.handleOnIOSViewPagerPageSelected}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        horizontal
        initialScrollIndex={index}
        windowSize={LIST_WINDOW_SIZE}
        initialNumToRender={3}
        pagingEnabled
        debug={false}
        maxToRenderPerBatch={LIST_WINDOW_SIZE}
        getItemLayout={(data, i) => ({
          length: globalStyleVariables.WINDOW_WIDTH,
          offset: globalStyleVariables.WINDOW_WIDTH * i,
          index: i,
        })}
      />
    );
  }
}

export default PXViewPager;

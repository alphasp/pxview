import React, { Component } from 'react';
import { View, Platform, FlatList } from 'react-native';
import { withTheme } from 'react-native-paper';
import PagerView from 'react-native-pager-view';
import Loader from './Loader';
import { globalStyles, globalStyleVariables } from '../styles';

const LIST_WINDOW_SIZE = 3;

class PXViewPager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPage: props.index,
    };
  }

  handleOnIOSViewPagerPageSelected = (e) => {
    const { onPageSelected } = this.props;
    const { contentOffset } = e.nativeEvent;
    const viewSize = e.nativeEvent.layoutMeasurement;
    // Divide the horizontal offset by the width of the view to see which page is visible
    const index = Math.round(contentOffset.x / viewSize.width);
    if (index > -1) {
      onPageSelected(index);
    }
  };

  handleOnAndroidViewPagerPageSelected = (e) => {
    const { items, onEndReached, onPageSelected } = this.props;
    const index = e.nativeEvent.position;
    onPageSelected(index);
    if (onEndReached && index >= items.length - 2) {
      onEndReached();
    }
  };

  renderContentForAndroid = () => {
    const { items, keyExtractor, renderContent, index, theme } = this.props;
    const size = Math.floor(LIST_WINDOW_SIZE / 2);
    return items.map((item, i) => {
      if (i >= index - size && i <= index + size) {
        return renderContent({ item, index: i });
      }
      const key = keyExtractor(item, i);
      return (
        <View key={key} style={{ backgroundColor: theme.colors.background }}>
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
      theme,
    } = this.props;
    const { initialPage } = this.state;
    if (Platform.OS === 'android') {
      return (
        <PagerView
          ref={viewPagerRef}
          key={`pxViewPager-${items.length}`} // https://github.com/facebook/react-native/issues/4775
          // changing initialPage on the fly causes another call to
          // onPageSelected (whole PagerView is rerendered?), which leads to
          // pages jumping back and forth while quickly browsing forward or
          // backward
          initialPage={initialPage}
          style={[
            globalStyles.container,
            { backgroundColor: theme.colors.background },
          ]}
          onPageSelected={this.handleOnAndroidViewPagerPageSelected}
        >
          {this.renderContentForAndroid()}
        </PagerView>
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

export default withTheme(PXViewPager);

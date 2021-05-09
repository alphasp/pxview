import React, { Component } from 'react';
import { View, Platform, FlatList } from 'react-native';
import { withTheme } from 'react-native-paper';
import ViewPager from '@react-native-community/viewpager';
import Loader from './Loader';
import { globalStyles, globalStyleVariables } from '../styles';

const LIST_WINDOW_SIZE = 3;

class PXViewPager extends Component {
  state = {
    isMounted: false,
  };

  componentDidMount() {
    this.setState({
      isMounted: true,
    });
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
    const { isMounted } = this.state;
    if (Platform.OS === 'android') {
      if (!isMounted) {
        return <Loader />;
      }
      return (
        <ViewPager
          ref={viewPagerRef}
          key={`pxViewPager-${items.length}`} // https://github.com/facebook/react-native/issues/4775
          initialPage={index}
          style={[
            globalStyles.container,
            { backgroundColor: theme.colors.background },
          ]}
          onPageSelected={this.handleOnAndroidViewPagerPageSelected}
        >
          {this.renderContentForAndroid()}
        </ViewPager>
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

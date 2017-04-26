import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { TabViewAnimated, TabBar, TabViewPagerScroll, TabViewPagerPan } from 'react-native-tab-view';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class PXTabView extends Component {
  static defaultProps = {
    lazy: true
  };

  renderHeader = (props) => {
    const { includeStatusBarPadding, tabBarProps } = this.props;
    return (
      <TabBar 
        style={{
          paddingTop: includeStatusBarPadding ? STATUSBAR_HEIGHT : 0
        }}
        {...tabBarProps}
        {...props} 
      />
    );
  }

  renderPager = (props) => {
   return (Platform.OS === 'ios') ? <TabViewPagerScroll {...props} /> : <TabViewPagerPan {...props} />
  }

  render() {
    const { screenProps, navigationState, renderScene, onRequestChangeTab, lazy, ...restProps } = this.props;
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={navigationState}
        renderScene={renderScene}
        renderHeader={this.renderHeader}
        renderPager={this.renderPager}
        onRequestChangeTab={onRequestChangeTab}
        lazy={lazy}
        {...restProps}
      />
    );
  }
}

export default PXTabView;

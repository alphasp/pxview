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
  renderPager = (props) => {
   return (Platform.OS === 'ios') ? <TabViewPagerScroll {...props} /> : <TabViewPagerPan {...props} />
  }

  render() {
    const { screenProps, navigationState, renderHeader, renderScene, onRequestChangeTab, ...restProps } = this.props;
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={navigationState}
        renderScene={renderScene}
        renderHeader={renderHeader}
        renderPager={this.renderPager}
        onRequestChangeTab={onRequestChangeTab}
        lazy
        {...restProps}
      />
    );
  }
}

export default PXTabView;

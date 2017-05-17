import React, { Component } from 'react';
import { StyleSheet, Platform } from 'react-native';
import {
  TabViewAnimated,
  TabBar,
  TabViewPagerScroll,
  TabViewPagerPan,
} from 'react-native-tab-view';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class PXTabView extends Component {
  static defaultProps = {
    lazy: true,
  };

  renderHeader = props => {
    const { includeStatusBarPadding, tabBarProps } = this.props;
    return (
      <TabBar
        style={{
          paddingTop: includeStatusBarPadding
            ? globalStyleVariables.STATUSBAR_HEIGHT
            : 0,
        }}
        {...tabBarProps}
        {...props}
      />
    );
  };

  renderPager = props =>
    Platform.OS === 'ios'
      ? <TabViewPagerScroll {...props} />
      : <TabViewPagerPan {...props} />;

  render() {
    const {
      navigationState,
      renderScene,
      onRequestChangeTab,
      lazy,
      ...restProps
    } = this.props;
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

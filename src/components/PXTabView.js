import React, { Component } from 'react';
import { StyleSheet, Platform } from 'react-native';
import {
  TabViewAnimated,
  TabBar,
  TabViewPagerScroll,
  TabViewPagerPan,
} from 'react-native-tab-view';
import { withTheme } from 'react-native-paper';
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
    const { includeStatusBarPadding, tabBarProps, theme } = this.props;
    return (
      <TabBar
        style={{
          paddingTop: includeStatusBarPadding
            ? globalStyleVariables.STATUSBAR_HEIGHT
            : 0,
          backgroundColor: theme.colors.headerBackground,
        }}
        labelStyle={{
          marginVertical: 8,
          marginHorizontal: 0,
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
      onIndexChange,
      lazy,
      theme,
      ...restProps
    } = this.props;
    return (
      <TabViewAnimated
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        navigationState={navigationState}
        renderScene={renderScene}
        renderHeader={this.renderHeader}
        renderPager={this.renderPager}
        onIndexChange={onIndexChange}
        lazy={lazy}
        {...restProps}
      />
    );
  }
}

export default withTheme(PXTabView);

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, View, Platform, StatusBar } from 'react-native';
import { HeaderBackButton, withNavigation } from 'react-navigation';
import DrawerMenuButton from '../components/DrawerMenuButton';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    paddingTop: globalStyleVariables.STATUSBAR_HEIGHT,
  },
  containerShadow: {
    ...Platform.select({
      ios: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(0, 0, 0, .3)',
      },
      android: {
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: StyleSheet.hairlineWidth,
        shadowOffset: {
          height: StyleSheet.hairlineWidth,
        },
        elevation: 4,
      },
    }),
  },
  containerDark: {
    backgroundColor: globalStyleVariables.PRIMARY_COLOR,
  },
  absolutePosition: {
    position: 'absolute',
    top: StatusBar.currentHeight || 0, // android only for use with translucent status bar
    left: 0,
    right: 0,
    bottom: 0,
    height:
      globalStyleVariables.APPBAR_HEIGHT +
      globalStyleVariables.STATUSBAR_HEIGHT,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, .3)',
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

class PXHeader extends Component {
  static propTypes = {
    onPressBackButton: PropTypes.func,
    showMenuButton: PropTypes.bool,
    showBackButton: PropTypes.bool,
    headerTitle: PropTypes.element,
    headerRight: PropTypes.element,
    darkTheme: PropTypes.bool,
  };

  static defaultProps = {
    onPressBackButton: null,
    showMenuButton: false,
    showBackButton: false,
    headerTitle: null,
    headerRight: null,
    darkTheme: false,
    withShadow: true,
  };

  handleOnPressDrawerMenuButton = () => {
    const { navigation } = this.props;
    navigation.navigate('DrawerOpen');
  };

  handleOnPressBackButton = () => {
    const { onPressBackButton, navigation: { goBack } } = this.props;
    if (onPressBackButton) {
      onPressBackButton();
    } else {
      goBack();
    }
  };

  render() {
    const {
      showMenuButton,
      showBackButton,
      headerTitle,
      headerRight,
      darkTheme,
      absolutePosition,
      withShadow,
    } = this.props;
    return (
      <View
        style={[
          styles.container,
          darkTheme && styles.containerDark,
          absolutePosition && styles.absolutePosition,
          withShadow && styles.containerShadow,
        ]}
      >
        <View style={styles.subContainer}>
          {showMenuButton &&
            <DrawerMenuButton
              onPress={this.handleOnPressDrawerMenuButton}
              color={darkTheme ? '#fff' : globalStyleVariables.PRIMARY_COLOR}
            />}
          {showBackButton &&
            <HeaderBackButton
              onPress={this.handleOnPressBackButton}
              tintColor={darkTheme && '#fff'}
            />}
          {headerTitle}
          {headerRight}
        </View>
      </View>
    );
  }
}

export default withNavigation(PXHeader);

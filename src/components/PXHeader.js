import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { HeaderBackButton, withNavigation } from 'react-navigation';
import DrawerMenuButton from '../components/DrawerMenuButton';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    paddingTop: globalStyleVariables.STATUSBAR_HEIGHT,
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
    } = this.props;
    return (
      <View style={[styles.container, darkTheme && styles.containerDark]}>
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

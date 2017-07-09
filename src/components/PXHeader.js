import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { HeaderBackButton, withNavigation } from 'react-navigation';
import DrawerMenuButton from '../components/DrawerMenuButton';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    paddingTop: globalStyleVariables.STATUSBAR_HEIGHT,
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

class PXHeader extends Component {
  static propTypes = {
    onPressBackButton: PropTypes.func,
    showMenuButton: PropTypes.bool,
    showBackButton: PropTypes.bool,
    headerTitle: PropTypes.element,
    headerRight: PropTypes.element,
  };

  static defaultProps = {
    onPressBackButton: null,
    showMenuButton: false,
    showBackButton: false,
    headerTitle: null,
    headerRight: null,
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
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          {showMenuButton &&
            <DrawerMenuButton
              onPress={this.handleOnPressDrawerMenuButton}
              color={globalStyleVariables.PRIMARY_COLOR}
            />}
          {showBackButton &&
            <HeaderBackButton onPress={this.handleOnPressBackButton} />}
          {headerTitle}
          {headerRight}
        </View>
      </View>
    );
  }
}

export default withNavigation(PXHeader);

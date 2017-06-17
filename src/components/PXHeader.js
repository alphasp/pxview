import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { HeaderBackButton, withNavigation } from 'react-navigation';
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
    showBackButton: PropTypes.bool,
    headerTitle: PropTypes.element,
    headerRight: PropTypes.element,
  };

  static defaultProps = {
    onPressBackButton: null,
    showBackButton: false,
    headerTitle: null,
    headerRight: null,
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
    const { showBackButton, headerTitle, headerRight } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
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

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import HeaderBackButton from 'react-navigation/src/views/HeaderBackButton';
import PXSearchBar from './PXSearchBar';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingTop: STATUSBAR_HEIGHT,
  },
  subContainer: {
    flexDirection: 'row',
  },
});

class PXHeader extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    onPressBackButton: PropTypes.func,
    onFocusSearchBar: PropTypes.func.isRequired,
    onChangeSearchText: PropTypes.func.isRequired,
    showBackButton: PropTypes.bool,
    headerRight: PropTypes.element,
  };

  static defaultProps = {
    onPressBackButton: null,
    showBackButton: false,
    headerRight: null,
  };

  render() {
    const {
      word,
      showBackButton,
      headerRight,
      navigation,
      isPushNewSearch,
      onPressBackButton,
      onFocusSearchBar,
      onChangeSearchText,
      onSubmitSearch,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          {showBackButton && <HeaderBackButton onPress={onPressBackButton} />}
          <PXSearchBar
            textInputRef="email"
            onFocus={onFocusSearchBar}
            onChangeText={onChangeSearchText}
            onSubmitSearch={onSubmitSearch}
            navigation={navigation}
            isPushNewSearch={isPushNewSearch}
            word={word}
          />
          {headerRight}
        </View>
      </View>
    );
  }
}

export default PXHeader;

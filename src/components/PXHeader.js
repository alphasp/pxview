import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import PXSearchBar from './PXSearchBar';
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
    navigation: PropTypes.object.isRequired,
    onPressBackButton: PropTypes.func,
    onFocusSearchBar: PropTypes.func.isRequired,
    onChangeSearchText: PropTypes.func.isRequired,
    showBackButton: PropTypes.bool,
    showSearchBar: PropTypes.bool,
    headerTitle: PropTypes.element,
    headerRight: PropTypes.element,
  };

  static defaultProps = {
    onPressBackButton: null,
    showBackButton: false,
    showSearchBar: true,
    headerTitle: null,
    headerRight: null,
  };

  render() {
    const {
      word,
      showBackButton,
      showSearchBar,
      headerTitle,
      headerRight,
      navigation,
      isPushNewSearch,
      onPressBackButton,
      onFocusSearchBar,
      onBlurSearchBar,
      onChangeSearchText,
      onSubmitSearch,
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          {showBackButton && <HeaderBackButton onPress={onPressBackButton} />}
          {headerTitle ||
            (showSearchBar &&
              <PXSearchBar
                textInputRef="email"
                onFocus={onFocusSearchBar}
                onBlur={onBlurSearchBar}
                onChangeText={onChangeSearchText}
                onSubmitSearch={onSubmitSearch}
                navigation={navigation}
                isPushNewSearch={isPushNewSearch}
                word={word}
              />)}
          {headerRight}
        </View>
      </View>
    );
  }
}

export default PXHeader;

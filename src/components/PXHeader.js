import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  Platform,
  Keyboard,
} from 'react-native';
import HeaderBackButton from 'react-navigation/src/views/HeaderBackButton';
import PXSearchBar from './PXSearchBar';
import { SearchType } from '../common/actions/searchType';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    paddingTop: STATUSBAR_HEIGHT
  },
  subContainer: {
    flexDirection: "row"
  }
});

class PXHeader extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    searchType: PropTypes.string, 
    onPressBackButton: PropTypes.func, 
    onFocusSearchBar: PropTypes.func.isRequired, 
    onChangeSearchText: PropTypes.func.isRequired,
    showBackButton: PropTypes.bool,
    headerRight: PropTypes.element,
  }

  render() {
    const { word, showBackButton, showRightButton, headerRight, navigation, searchType, isPushNewSearch, onPressBackButton, onFocusSearchBar, onChangeSearchText } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          {
            showBackButton &&
            <HeaderBackButton onPress={onPressBackButton} />
          }
          <PXSearchBar 
            ref='searchBar'
            textInputRef='email'
            onFocus={onFocusSearchBar}
            onChangeText={onChangeSearchText}
            searchType={searchType}
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

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { SearchBar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import PXTouchable from './PXTouchable';
import SearchTags from './SearchTags';
import * as searchHistoryActionCreators from '../common/actions/searchHistory';
import { SearchType } from '../common/actions/searchType';

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: STATUSBAR_HEIGHT,
    // //backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
    // shadowColor: 'black',
    // shadowOpacity: 0.1,
    // shadowRadius: StyleSheet.hairlineWidth,
    // shadowOffset: {
    //   height: StyleSheet.hairlineWidth,
    // },
    // elevation: 4,
    // marginHorizontal: 5,
    // height: STATUSBAR_HEIGHT + APPBAR_HEIGHT,
    //width: windowWidth,
    //flex: 1,
    // flexDirection: 'row',
    // alignItems: 'center',
    // marginHorizontal: 16
  },
  searchBarInputGroup: {
    flex: 1,
    paddingHorizontal: 5,
    position: 'relative',
    justifyContent: 'space-between',
    //justifyContent: 'center',
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        backgroundColor: '#D1EEFC',
        borderRadius: 5, // this.props.rounded ? 25 : 2,
        height: 30,
        borderColor: 'transparent',
      },
      android: {
        // backgroundColor: '#fff',
        // borderRadius: 2,
        // borderColor: 'transparent',
        // elevation: 2,
        backgroundColor: '#D1EEFC',
        borderRadius: 5, // this.props.rounded ? 25 : 2,
        borderColor: 'transparent',
        height: 37,
      },
    })
  },
  searchBarTextInput: {
    //height: 40,
    flex: 1,
    paddingLeft: 5,
    //alignSelf: 'center', 
    //width: 300
  },
  searchIcon: {
    alignSelf: 'center', 
    paddingLeft: 5
    //flex: 0.2
  },
  placeHolderTextContainer: {
    alignSelf: 'center', 
  },
  placeHolderText: {
    color: 'gray', 
  }
  // searchBarButton: {
  //   alignItems: 'center', 
  //   justifyContent: 'center', 
  //   flexDirection: 'row',
  //   marginRight: -14
  // }
});

class PXSearchBar extends Component {
  static defaultProps = {
    searchType: SearchType.ILLUST
  }
  // handleOnChangeSearchText = (word, searchType) => {
  //   const { fetchSearchAutoComplete, clearSearchAutoComplete, fetchSearchUserAutoComplete, clearSearchUserAutoComplete } = this.props;
  //   console.log('handleOnChangeSearchText ', searchType, word)
  //   if (searchType === SearchType.USER) {
  //     clearSearchUserAutoComplete();
  //     if (word.length > 1) {
  //       fetchSearchUserAutoComplete(word);
  //     }
  //   }
  //   else {
  //     clearSearchAutoComplete();
  //     if (word.length > 1) {
  //       fetchSearchAutoComplete(word);
  //     }
  //   }
  // }

  handleOnSubmitSearch = (word, searchType) => {
    const { navigation, addSearchHistory, isPushNewSearch, onSubmitSearch } = this.props;
    word = word.trim();
    if (word) {
      const { navigate, setParams, searchType } = navigation;
      addSearchHistory(word);
      onSubmitSearch(word);
      if (isPushNewSearch) {
        navigate('SearchResult', { word, searchType });
      }
    }
  }

  render() {
    const { searchType, isRenderBackButton, isRenderRightButton, isRenderPlaceHolder, onFocus, onChangeText, onSubmitEditing, onPressRemoveTag, autoFocus, word } = this.props;
    let style = {};
    // if (isRenderBackButton && isRenderRightButton) {
    //   style = {
    //     width: windowWidth - 68,
    //     //marginHorizontal: 54
    //   };
    // }
    // else if (isRenderBackButton) {
    //   style = {
    //     width: windowWidth - 34,
    //     marginLeft: 34
    //   };
    // }
    // else if (isRenderRightButton) {
    //   style = {
    //     width: windowWidth - 34,
    //     marginRight: 34
    //   };
    // }
    return (
      <View style={[styles.container, style]}>
        <SearchBar
          containerStyle={{backgroundColor: "#fff", borderTopWidth: 0, borderBottomWidth: 0}}
          lightTheme
          placeholder={searchType === SearchType.USER ? "Enter nickname" : "Enter keyword"}
          autoFocus={autoFocus}
          onFocus={() => onFocus && onFocus(searchType)}
          onChangeText={(text) => onChangeText(text, searchType)}
          onSubmitEditing={(e) => this.handleOnSubmitSearch(e.nativeEvent.text, searchType)}
          returnKeyType="search"
          defaultValue={word}
          underlineColorAndroid='transparent'
        />
      </View>
    );
  }
}

export default connect((state, { searchType }) => {
  return {
    searchType: state.searchType.type //searchType || state.searchType.type
  }
}, searchHistoryActionCreators)(PXSearchBar);

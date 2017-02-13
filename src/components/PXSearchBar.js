import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { connect } from 'react-redux';
import { SearchBar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import PXTouchable from './PXTouchable';
import SearchTags from './SearchTags';
import * as searchAutoCompleteActionCreators from '../common/actions/searchAutoComplete';
import * as searchUserAutoCompleteActionCreators from '../common/actions/searchUserAutoComplete';
import { SearchType } from '../common/actions/searchType';

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    paddingTop: STATUSBAR_HEIGHT,
    //backgroundColor: Platform.OS === 'ios' ? '#EFEFF2' : '#FFF',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
    },
    elevation: 4,
    marginHorizontal: 5,
  },
  appBar: {
    height: APPBAR_HEIGHT,
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
  handleOnChangeSearchText = (word, searchType) => {
    const { fetchSearchAutoComplete, clearSearchAutoComplete, fetchSearchUserAutoComplete, clearSearchUserAutoComplete } = this.props;
    if (searchType === SearchType.USER) {
      clearSearchUserAutoComplete();
      if (word.length > 1) {
        fetchSearchUserAutoComplete(word);
      }
    }
    else {
      clearSearchAutoComplete();
      if (word.length > 1) {
        fetchSearchAutoComplete(word);
      }
    }
  }

  handleOnSubmitSearch = (word, searchType) => {
    const { navigation, isPushNewSearch } = this.props;
    word = word.trim();
    if (word) {
      const { navigate, setParams, searchType } = navigation;
      if (searchType === SearchType.USER) {
        // Actions.searchUserResult({ word: word, type: ActionConst.REPLACE });
      }
      else {
        console.log('isPushNewSearch ', isPushNewSearch)
        if (isPushNewSearch) {
          navigate('SearchResult', { word });
        }
        setTimeout(() => {
          setParams({
            isFocusSearchBar: false,
            word
          });
        }, 0);
      }
    }
  }

  render() {
    const { searchType, isRenderFullHeader, isRenderPlaceHolder, enableBack, onFocus, onChangeText, onSubmitEditing, onPressRemoveTag, autoFocus, word } = this.props;
    const style = {}
    return (
      <View style={[styles.container, !isRenderFullHeader && {
        flex: 1,
        paddingTop: 0
      }]}>
        <View style={styles.appBar}>
          <SearchBar
            containerStyle={{backgroundColor: "#fff", borderTopWidth: 0, borderBottomWidth: 0}}
            lightTheme
            placeholder={searchType === SearchType.USER ? "Enter nickname" : "Enter keyword"}
            autoFocus={autoFocus}
            onFocus={() => onFocus && onFocus(searchType)}
            onChangeText={(text) => !isRenderPlaceHolder ? this.handleOnChangeSearchText(text, searchType) : onFocus(searchType)}
            onSubmitEditing={(e) => !isRenderPlaceHolder && this.handleOnSubmitSearch(e.nativeEvent.text, searchType)}
            returnKeyType="search"
            defaultValue={word}
            underlineColorAndroid='transparent'
          />
        </View>
      </View>
    );
  }
}

export default connect((state, { searchType }) => {
  return {
    searchType: searchType || state.searchType.type
  }
}, {  
  ...searchAutoCompleteActionCreators, 
  ...searchUserAutoCompleteActionCreators
})(PXSearchBar);

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  RecyclerViewBackedScrollView,
  RefreshControl,
  InteractionManager,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions, CardStack } from 'react-navigation';
const { BackButton } = CardStack.Header;
import { Actions, ActionConst } from 'react-native-router-flux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import Search2 from './Search2';
import PXSearchBar from '../components/PXSearchBar';
import PXTouchable from '../components/PXTouchable';
import SearchResult from './SearchResult';
import SearchUserResult from './SearchUserResult';
import { fetchSearch, clearSearch, SortType } from '../common/actions/search';
import { SearchType } from '../common/actions/searchType';
import { clearSearchAutoComplete } from '../common/actions/searchAutoComplete';
import { clearSearchUserAutoComplete } from '../common/actions/searchUserAutoComplete';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

const onPressBackButton = (navigation) => {
  const { setParams, goBack, state }  = navigation;
  const { isFocusSearchBar, initSearchWord, word, clearSearchAutoComplete, clearSearchUserAutoComplete } = state.params;
  clearSearchAutoComplete();
  clearSearchUserAutoComplete();
  if (isFocusSearchBar) {
    Keyboard.dismiss();
    setParams({
      isFocusSearchBar: false,
      newWord: word
    });
  }
  else {
    goBack();
  }
}

const handleOnChangeSearchText = (setParams) => (word, searchType) => {
  setParams({ newWord: word });
}

class SearchResultTabs extends Component {
  static navigationOptions = {
    header: (navigation, defaultHeader) => {
      const { state, setParams, navigate, goBack, dispatch } = navigation;
      const { word, newWord, searchOptions, isFocusSearchBar } = state.params;
      return {
        ...defaultHeader,
        left: (
          <BackButton onPress={() => onPressBackButton(navigation)} />
        ),
        title:  (
          <PXSearchBar 
            enableBack={true} 
            onFocus={() => setParams({
              isFocusSearchBar: true
            })}
            searchType={SearchType.ILLUST}
            word={newWord !== undefined ? newWord : word}
            onChangeText={handleOnChangeSearchText(setParams)}
            navigation={navigation}
          />
        ),
        //disabled
        right: (
          <PXTouchable
            onPress={() => navigate("SearchFilterModal", { 
              searchFilter: searchOptions || {}, 
              onPressApplyFilter: (target, duration) => {
                goBack(null);
                setTimeout(() => setParams({
                  searchOptions: {
                    duration: duration || undefined,
                    target: target || undefined,
                  },
                }), 0);
                setParams({
                  searchOptions: {
                    duration: duration || undefined,
                    target: target || undefined,
                  },
                })
                {/*this.props.navigation.dispatch({
                  type: 'goBackAndSetParams',
                  params: {
                    searchOptions: {
                      duration: duration || undefined,
                      target: target || undefined,
                    },
                  }
                })*/}
              }
            })}
          >
            <Icon 
              name="sliders" 
              size={20} 
              color="#037aff"
              style={{padding: 10}}
            />
          </PXTouchable>
        )
      }
    }
  }

  constructor(props) {
    super(props);
    // this.state = {
    //   searchOptions: {}
    // };
  }

  componentDidMount() {
    const { clearSearchAutoComplete, clearSearchUserAutoComplete, navigation } = this.props;
    const { setParams } = navigation;
    setParams({ 
      clearSearchAutoComplete, 
      clearSearchUserAutoComplete 
    });
  }

  handleOnPressRemoveTag = (index) => {
    const { dispatch, word } = this.props;
    const newWord = word.split(' ').filter((value, i) => {
      return i !== index;
    }).join(' ');
    console.log('new word ', newWord);
    if (newWord) {
      Actions.refresh({
        word: newWord,
        renderTitle: () => {
          return (
            <SearchBar 
              enableBack={true} 
              onFocus={this.handleOnSearchFieldFocus} 
              onSubmitEditing={this.handleOnSubmitSearch}
              onPressRemoveTag={this.handleOnPressRemoveTag}
              isRenderPlaceHolder={true}
              word={newWord}
            />
          )
        }
      });
    }
    else {
      Actions.pop();
    }
  }

  // handleOnSubmitSearch = (word) => {
  //   word = word.trim();
  //   if (word) {
  //     const { navigation: { setParams }, searchType } = this.props;
  //     if (searchType === SearchType.USER) {
  //       // Actions.searchUserResult({ word: word, type: ActionConst.REPLACE });
  //     }
  //     else {
  //       Keyboard.dismiss();
  //       setParams({
  //         isFocusSearchBar: false,
  //         word
  //       });
  //       //setTimeout(() => navigate('SearchResult', { word }), 0)
  //       //Actions.searchResult({ word: word, type: ActionConst.REPLACE });
  //     }
  //   }
  // }

  render() {
    const { searchType, navigationStateKey, navigation } = this.props;
    const { word, newWord, searchOptions, isFocusSearchBar } = navigation.state.params;
    return (
      <View style={styles.container} >
        <ScrollableTabView initialPage={searchType === SearchType.USER ? 1 : 0}>
          <SearchResult 
            tabLabel="Illust/Manga" 
            word={word} 
            options={searchOptions} 
            sortType={SortType.DESC}
            navigation={navigation}
            navigationStateKey={navigationStateKey}
          />
          <SearchUserResult  
            tabLabel="User" 
            word={word} 
            navigation={navigation}
          />
        </ScrollableTabView>
        { 
          isFocusSearchBar &&
          <Search2 
            word={newWord}
            navigation={navigation} 
            searchType={searchType} 
          />
        }
      </View>
    );
  }
}

export default connect((state, props) => {
  return {
    searchType: state.searchType.type,
    word: props.navigation.state.params.word,
    navigationStateKey: props.navigation.state.key
  }
}, { clearSearchAutoComplete, clearSearchUserAutoComplete })(SearchResultTabs);
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
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions, CardStack } from 'react-navigation';
const { BackButton } = CardStack.Header;
import { Actions, ActionConst } from 'react-native-router-flux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import Search2 from './Search2';
import PXSearchBar from '../components/PXSearchBar';
import SearchResult from './SearchResult';
import { fetchSearch, clearSearch, SortType } from '../common/actions/search';
import { SearchType } from '../common/actions/searchType';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

onPressBackButton = (navigation) => {
  const { setParams, goBack, state }  = navigation;
  const { isFocusSearchBar } = state.params;
  if (isFocusSearchBar) {
    Keyboard.dismiss();
    setParams({
      isFocusSearchBar: false
    });
  }
  else {
    goBack();
  }
}

class SearchResultTabs extends Component {
  static navigationOptions = {
    header: (navigation, defaultHeader) => {
      const { state, setParams, navigate, goBack, dispatch } = navigation;
      const { word, searchOptions, isFocusSearchBar } = state.params;
      return {
        ...defaultHeader,
        left: (
          <BackButton onPress={() => onPressBackButton(navigation)} />
        ),
        title: word ? (
          <PXSearchBar 
            enableBack={true} 
            onFocus={() => setParams({
              isFocusSearchBar: true
            })}
            searchType={SearchType.ILLUST}
            word={word}
            navigation={navigation}
          />
        ) : null,
        right: (
          <Icon 
            name="sliders" 
            size={20} 
            color="#037aff"
            style={{padding: 10}}
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
              }
            })}
          />
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

  handleOnSubmitSearch = (word) => {
    word = word.trim();
    if (word) {
      const { navigation: { setParams }, searchType } = this.props;
      if (searchType === SearchType.USER) {
        // Actions.searchUserResult({ word: word, type: ActionConst.REPLACE });
      }
      else {
        Keyboard.dismiss();
        setParams({
          isFocusSearchBar: false,
          word
        });
        //setTimeout(() => navigate('SearchResult', { word }), 0)
        //Actions.searchResult({ word: word, type: ActionConst.REPLACE });
      }
    }
  }

  render() {
    const { navigationStateKey, word, navigation } = this.props;
    const { searchOptions, isFocusSearchBar } = navigation.state.params;
    return (
      <View style={styles.container} >
        <ScrollableTabView>
          <SearchResult 
            tabLabel="Newest" 
            word={word} 
            options={searchOptions} 
            sortType={SortType.DESC}
            navigation={navigation}
            navigationStateKey={navigationStateKey}
          />
          <SearchResult 
            tabLabel="Oldest" 
            word={word} 
            options={searchOptions}
            sortType={SortType.ASC}
            navigation={navigation}
            navigationStateKey={navigationStateKey}
          />
        </ScrollableTabView>
        { 
          isFocusSearchBar &&
          <Search2 navigation={navigation} onSubmitSearch={this.handleOnSubmitSearch} />
        }
      </View>
    );
  }
}

export default connect((state, props) => {
  return {
    word: props.navigation.state.params.word,
    navigationStateKey: props.navigation.state.key
  }
})(SearchResultTabs);
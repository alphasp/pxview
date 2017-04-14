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
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import Search2 from './Search2';
import PXSearchBar from '../components/PXSearchBar';
import PXTouchable from '../components/PXTouchable';
import SearchResult from './SearchResult';
import SearchUsersResult from './SearchUsersResult';
import { setSearchType, SearchType } from '../common/actions/searchType';
import { clearSearchAutoComplete } from '../common/actions/searchAutoComplete';
import { clearSearchUserAutoComplete } from '../common/actions/searchUsersAutoComplete';

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
      const { word, newWord, searchOptions, searchType, isFocusSearchBar } = state.params;
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
            searchType={searchType}
            word={newWord !== undefined ? newWord : word}
            onChangeText={handleOnChangeSearchText(setParams)}
            navigation={navigation}
            isRenderBackButton={true}
            isRenderRightButton={true}
          />
        ),
        //disabled
        right: (
          <PXTouchable
            disabled={searchType === SearchType.USER}
            onPress={() => navigate("SearchFilterModal", { 
              searchFilter: searchOptions || {}, 
              onPressApplyFilter: (target, duration, sort) => {
                goBack(null);
                setTimeout(() => setParams({
                  searchOptions: {
                    duration,
                    target,
                    sort
                  },
                }), 0);
                setParams({
                  searchOptions: {
                    duration,
                    target,
                    sort
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
              color={searchType === SearchType.USER ? "grey" : "#037aff"}
              style={{padding: 10}}
            />
          </PXTouchable>
        )
      }
    }
  }

  constructor(props) {
    super(props);
    const { searchType } = props;
    this.state = {
      initSearchType: searchType
    };
  }

  componentDidMount() {
    const { searchType, clearSearchAutoComplete, clearSearchUserAutoComplete, navigation } = this.props;
    const { setParams } = navigation;
    setParams({ 
      searchType,
      clearSearchAutoComplete, 
      clearSearchUserAutoComplete
    });
  }

  componentWillReceiveProps(nextProps) {
    const { searchType: prevSearchType } = this.props;
    const { searchType, navigation: { setParams } } = nextProps;
    if (searchType !== prevSearchType) {
      setParams({ searchType });
    }
  }

  handleOnPressRemoveTag = (index) => {
    const { dispatch, word } = this.props;
    const newWord = word.split(' ').filter((value, i) => {
      return i !== index;
    }).join(' ');
    console.log('new word ', newWord);
    /*if (newWord) {
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
    }*/
  }

  handleOnChangeTab = ({ i, ref }) => {
    const { setSearchType } = this.props;
    if (i === 1) {
      setSearchType(SearchType.USER);
    }
    else {
      setSearchType(SearchType.ILLUST);
    }
  }

  render() {
    const { searchType, navigationStateKey, navigation } = this.props;
    const { initSearchType } = this.state;
    const { word, newWord, searchOptions, isFocusSearchBar } = navigation.state.params;
    return (
      <View style={styles.container} >
        <ScrollableTabView 
          initialPage={initSearchType === SearchType.USER ? 1 : 0}
          onChangeTab={this.handleOnChangeTab}
        >
          <SearchResult 
            tabLabel="Illust/Manga" 
            word={word} 
            options={searchOptions} 
            navigation={navigation}
            navigationStateKey={navigationStateKey}
          />
          <SearchUsersResult  
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
}, { clearSearchAutoComplete, clearSearchUserAutoComplete, setSearchType })(SearchResultTabs);


//result tabs [0, 1]
//1
//s tabs [0, 1]
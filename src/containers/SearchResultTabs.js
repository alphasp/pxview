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
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { Actions, ActionConst } from 'react-native-router-flux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import PXSearchBar from '../components/PXSearchBar';
import SearchResult from './SearchResult';
import { fetchSearch, clearSearch, SortType } from '../common/actions/search';
import { SearchType } from '../common/actions/searchType';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

class SearchResultTabs extends Component {
  static navigationOptions = {
    header: (props, defaultHeader) => {
      const { state, setParams, navigate, goBack, dispatch } = props;
      const { word, searchOptions } = state.params;
      return {
        ...defaultHeader,
        title: word ? (
          <PXSearchBar 
            enableBack={true} 
            onFocus={() => navigate("Search", {
              word, 
              searchType: SearchType.ILLUST, 
              options: searchOptions || {}, 
              isPopAndReplaceOnSubmit: true,
              searchResultKey: state.key
            })}
            isRenderPlaceHolder={true}
            searchType={SearchType.ILLUST}
            word={word}
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
                {/*setParams({
                  searchOptions: {
                    duration: duration || undefined,
                    target: target || undefined,
                  }
                })*/}
                goBack(null);
                setTimeout(() => setParams({
                  searchOptions: {
                    duration: duration || undefined,
                    target: target || undefined,
                  },
                }), 0)
                {/*setTimeout(() => dispatch(NavigationActions.setParams({
                  params: {
                    searchOptions: {
                      duration: duration || undefined,
                      target: target || undefined,
                    },
                  },
                  key: state.key
                })), 100)*/}
              }
            })}
          />
        )
      }
    }
  }

 
//                 {/*console.log('state key ', state.key)
//                 const backAction = NavigationActions.back({
//                   action: dispatch(NavigationActions.setParams({
//                     searchOptions: {
//                       duration: duration || undefined,
//                       target: target || undefined,
//                     },
//                     key: state.key
//                   }))
//                 })
//                 dispatch(backAction)*/}

//               }
//             })}
  constructor(props) {
    super(props);
    // this.state = {
    //   searchOptions: {}
    // };
  }

  /*componentDidMount() {
    const { dispatch, word } = this.props;
    this.refreshNavigationBar(word);
  }

  componentWillReceiveProps(nextProps) {
    const { word: prevWord } = this.props;
    const { word } = nextProps;
    if (word !== prevWord) {
      this.refreshNavigationBar(word);
    }
  }

  refreshNavigationBar = (word) => {
    Actions.refresh({
      renderTitle: () => {
        return (
          <SearchBar 
            enableBack={true} 
            onFocus={this.handleOnSearchFieldFocus} 
            onPressRemoveTag={this.handleOnPressRemoveTag}
            isRenderPlaceHolder={true}
            isRenderRightButton={true}
            searchType={SearchType.ILLUST}
            word={word}
          />
        )
      },
      renderRightButton: () => {
        return (
          <Icon 
            name="sliders" 
            size={20} 
            onPress={this.handleOnPressFilterButton}
            color="#fff"
          />
        )
      },
    });
  }*/

  // handleOnSearchFieldFocus = () => {
  //   const { word } = this.props;
  //   const { searchOptions } = this.state;
  //   Actions.search({ word: word, searchType: SearchType.ILLUST, options: searchOptions, isPopAndReplaceOnSubmit: true });
  // }
  
  // handleOnPressFilterButton = () => {
  //   const { searchOptions } = this.state;
  //   Actions.searchFilter({ searchFilter: searchOptions, onPressApplyFilter: this.handleOnPressApplyFilter });
  // }

  // handleOnPressApplyFilter = (target, duration) => {
  //   const { dispatch, word } = this.props;
  //   Actions.pop();
  //   console.log('apply filter')
  //   this.setState({
  //     searchOptions: {
  //       duration: duration || undefined, 
  //       target: target || undefined, 
  //     }
  //   })
  // }


  // handleOnSubmitSearch = (word) => {
  //   const { dispatch } = this.props;
  //   word = word.trim();
  //   if (word) {
  //     //todo
  //     dispatch(clearSearch(word, null, SortType.ASC));
  //     dispatch(clearSearch(word, null, SortType.DESC));
  //     dispatch(fetchSearch(word));
  //     Actions.refresh({ word: word, type: ActionConst.REPLACE });
  //   }
  // }

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

  render() {
    const { navigationStateKey, word, navigation } = this.props;
    const { searchOptions } = navigation.state.params;
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
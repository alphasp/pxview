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
import { Actions, ActionConst } from 'react-native-router-flux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchBar from '../components/SearchBar';
import SearchResult from './SearchResult';
import { fetchSearch, clearSearch, SortType } from '../common/actions/search';
import { SearchType } from '../common/actions/searchType';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

class SearchResultTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchOptions: {}
    };
  }

  componentDidMount() {
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
  }

  handleOnSearchFieldFocus = () => {
    const { word } = this.props;
    const { searchOptions } = this.state;
    Actions.search({ word: word, searchType: SearchType.ILLUST, options: searchOptions, isPopAndReplaceOnSubmit: true });
  }
  
  handleOnPressFilterButton = () => {
    const { searchOptions } = this.state;
    Actions.searchFilter({ searchFilter: searchOptions, onPressApplyFilter: this.handleOnPressApplyFilter });
  }

  handleOnPressApplyFilter = (target, duration) => {
    const { dispatch, word } = this.props;
    Actions.pop();
    console.log('apply filter')
    this.setState({
      searchOptions: {
        duration: duration || undefined, 
        target: target || undefined, 
      }
    })
  }
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
    const { dispatch, navigationState, word } = this.props;
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
    const { navigationState, word } = this.props;
    const { searchOptions } = this.state;
    return (
      <View style={styles.container} >
        <ScrollableTabView>
          <SearchResult 
            tabLabel="Newest" 
            word={word} 
            options={searchOptions} 
            sortType={SortType.DESC}
            navigationStateKey={navigationState.key}
          />
          <SearchResult 
            tabLabel="Oldest" 
            word={word} 
            options={searchOptions}
            sortType={SortType.ASC}
            navigationStateKey={navigationState.key}
          />
        </ScrollableTabView>
      </View>
    );
  }
}


export default connect()(SearchResultTabs);
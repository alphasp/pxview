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

import SearchResultNewest from './SearchResultNewest';
import SearchResultOldest from './SearchResultOldest';
import { fetchSearch, clearSearch, SortType } from '../common/actions/search';
import { SearchType } from '../common/actions/searchType';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

class SearchResultTabs extends Component {
  componentDidMount() {
    const { dispatch, word } = this.props;
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
    Actions.search({ word: word, searchType: SearchType.ILLUST });
  }
  
  handleOnPressFilterButton = () => {
    console.log('on right');
    const searchFilter = { 
      target: null, 
      duration: null
    };
    Actions.searchFilter({ searchFilter });
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
    const { dispatch, word } = this.props;
    const newWord = word.split(' ').filter((value, i) => {
      return i !== index;
    }).join(' ');
    console.log('new word ', newWord);
    //todo
    if (newWord) {
      dispatch(clearSearch(newWord));
      dispatch(fetchSearch(newWord));
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
    const { word } = this.props;
    return (
      <View style={styles.container} >
        <ScrollableTabView>
          <SearchResultNewest tabLabel="Newest" word={word} />
          <SearchResultOldest tabLabel="Oldest" word={word} />
        </ScrollableTabView>
      </View>
    );
  }
}


export default connect()(SearchResultTabs);
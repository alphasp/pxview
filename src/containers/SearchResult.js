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
import Recommended from './Recommended';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';
import { fetchSearch, clearSearch } from '../common/actions/search';

class SearchResult extends Component {
  constructor(props) {
    super(props);
    const { word } = props;
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch, word } = this.props;
    Actions.refresh({
      renderTitle: () => {
        return (
          <Header>
            <SearchBar 
              enableBack={true} 
              onFocus={this.handleOnSearchFieldFocus} 
              onSubmitEditing={this.handleOnSubmitSearch}
              onChangeText={this.handleOnChangeSearchText}
              onPressRemoveTag={this.handleOnPressRemoveTag}
              isRenderPlaceHolder={true}
              word={word}
            />
          </Header>
        )
      }
    });

    dispatch(clearSearch(word));
    InteractionManager.runAfterInteractions(() => {
      dispatch(fetchSearch(word));
    });
  }

  handleOnSearchFieldFocus = () => {
    const { word } = this.props;
    Actions.search({ word: word });
  }
  
  loadMoreItems = () => {
    const { dispatch, search, word } = this.props;
    console.log('load more ', search[word].nextUrl)
    if (search[word] && search[word].nextUrl) {
      dispatch(fetchSearch(word, null, search[word].nextUrl));
    }
  }

  handleOnRefresh = () => {
    const { dispatch, word } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearSearch(word));
    dispatch(fetchSearch(word)).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  handleOnSubmitSearch = (word) => {
    const { dispatch } = this.props;
    word = word.trim();
    if (word) {
      dispatch(clearSearch(word));
      dispatch(fetchSearch(word));
      Actions.refresh({ word: word, type: ActionConst.REPLACE });
    }
  }

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
            <Header>
              <SearchBar 
                enableBack={true} 
                onFocus={this.handleOnSearchFieldFocus} 
                onSubmitEditing={this.handleOnSubmitSearch}
                onChangeText={this.handleOnChangeSearchText}
                onPressRemoveTag={this.handleOnPressRemoveTag}
                isRenderPlaceHolder={true}
                word={newWord}
              />
            </Header>
          )
        }
      });
    }
    else {
      Actions.pop();
    }
  }

  render() {
    const { search, word, options } = this.props;
    const { refreshing } = this.state;
    console.log('result ', search)
    return (
      (search[word] ? true : false) &&
      <Recommended
        recommended={search[word]}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  return {
    search: state.search,
    searchAutoComplete: state.searchAutoComplete
  }
})(SearchResult);
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
import { bindActionCreators } from 'multireducer';
import { Actions, ActionConst } from 'react-native-router-flux';
import RecommendedUser from './RecommendedUser';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';
import UserList from '../components/UserList';
import { fetchSearchUser, clearSearchUser } from '../common/actions/searchUser';
import { SearchType } from '../common/actions/searchType';

class SearchUserResult extends Component {
  constructor(props) {
    super(props);
    const { word } = props;
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch, word, fetchSearchUser, clearSearchUser } = this.props;
    this.refreshNavigationBar(word);
    clearSearchUser();
    InteractionManager.runAfterInteractions(() => {
      fetchSearchUser(word);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { word: prevWord } = this.props;
    const { dispatch, word, fetchSearchUser, clearSearchUser } = nextProps;
    if (word !== prevWord) {
      clearSearchUser();
      fetchSearchUser(word);
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
            searchType={SearchType.USER}
            word={word}
          />
        )
      }
    });
  }

  handleOnSearchFieldFocus = () => {
    const { word } = this.props;
    Actions.search({ word: word, searchType: SearchType.USER, isPopAndReplaceOnSubmit: true });
  }
  
  loadMore = () => {
    const { dispatch, searchUser: { nextUrl }, word, fetchSearchUser } = this.props;
    console.log('load more ', nextUrl)
    if (nextUrl) {
      fetchSearchUser(word, nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { dispatch, word, fetchSearchUser, clearSearchUser } = this.props;
    this.setState({
      refereshing: true
    });
    clearSearchUser();
    fetchSearchUser(word).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  handleOnPressRemoveTag = (index) => {
    const { dispatch, word, fetchSearchUser, clearSearchUser } = this.props;
    const newWord = word.split(' ').filter((value, i) => {
      return i !== index;
    }).join(' ');
    console.log('new word ', newWord);
    if (newWord) {
      clearSearchUser();
      fetchSearchUser(newWord);
      Actions.refresh({
        word: newWord,
        renderTitle: () => {
          return (
            <SearchBar 
              enableBack={true} 
              onFocus={this.handleOnSearchFieldFocus} 
              onPressRemoveTag={this.handleOnPressRemoveTag}
              isRenderPlaceHolder={true}
              searchType={SearchType.USER}
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
    const { searchUser, word } = this.props;
    const { refreshing } = this.state;
    return (
      <UserList
        userList={searchUser}
        refreshing={refreshing}
        loadMore={this.loadMore}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(state => {
  return {
    searchUser: state.searchUser,
  }
},(dispatch) => bindActionCreators({ fetchSearchUser, clearSearchUser }, dispatch, 'searchUser')
)(SearchUserResult);
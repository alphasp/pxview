import React, { Component } from 'react';
import { View, InteractionManager, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import UserList from '../components/UserList';
import { connectLocalization } from '../components/Localization';
import NoResult from '../components/NoResult';
import * as searchUsersActionCreators from '../common/actions/searchUsers';
import { makeGetSearchUsersItems } from '../common/selectors';
import { globalStyles, globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  nullResult: {
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
  },
});

class SearchUsersResult extends Component {
  componentDidMount() {
    const {
      navigationStateKey,
      fetchSearchUsers,
      clearSearchUsers,
      word,
    } = this.props;
    clearSearchUsers(navigationStateKey);
    InteractionManager.runAfterInteractions(() => {
      fetchSearchUsers(navigationStateKey, word);
    });
  }

  componentDidUpdate(prevProps) {
    const {
      navigationStateKey,
      fetchSearchUsers,
      clearSearchUsers,
      word,
    } = this.props;
    const { word: prevWord } = prevProps;
    if (word !== prevWord) {
      clearSearchUsers(navigationStateKey);
      fetchSearchUsers(navigationStateKey, word);
    }
  }

  loadMoreItems = () => {
    const {
      navigationStateKey,
      fetchSearchUsers,
      searchUsers: { nextUrl, loading },
      word,
    } = this.props;
    if (!loading && nextUrl) {
      fetchSearchUsers(navigationStateKey, word, nextUrl);
    }
  };

  handleOnRefresh = () => {
    const {
      navigationStateKey,
      fetchSearchUsers,
      clearSearchUsers,
      word,
    } = this.props;
    clearSearchUsers(navigationStateKey);
    fetchSearchUsers(navigationStateKey, word, null, true);
  };

  render() {
    const { searchUsers, items, i18n } = this.props;
    return (
      <View style={globalStyles.container}>
        <UserList
          userList={{ ...searchUsers, items }}
          loadMoreItems={this.loadMoreItems}
          onRefresh={this.handleOnRefresh}
        />
        {searchUsers && searchUsers.loaded && (!items || !items.length) && (
          <NoResult text={i18n.noSearchResult} style={styles.nullResult} />
        )}
      </View>
    );
  }
}

export default connectLocalization(
  connect(() => {
    const getSearchUsersItems = makeGetSearchUsersItems();
    return (state, props) => {
      const { searchUsers } = state;
      const { navigationStateKey } = props;
      const word = props.word || props.route.params.word;
      return {
        searchUsers: searchUsers[navigationStateKey],
        items: getSearchUsersItems(state, props),
        word,
      };
    };
  }, searchUsersActionCreators)(SearchUsersResult),
);

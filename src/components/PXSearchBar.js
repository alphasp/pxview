import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { withTheme, Searchbar } from 'react-native-paper';
// import { SearchBar } from 'react-native-elements';
import { connectLocalization } from './Localization';
import PXHeader from './PXHeader';
import * as searchHistoryActionCreators from '../common/actions/searchHistory';
import { SEARCH_TYPES } from '../common/constants';
import { globalStyles } from '../styles';

const styles = StyleSheet.create({
  searchBar: {
    marginRight: 5,
  },
});

class PXSearchBar extends Component {
  static defaultProps = {
    searchType: SEARCH_TYPES.ILLUST,
  };

  state = {
    firstQuery: '',
  };

  handleOnSubmitSearch = e => {
    const { addSearchHistory, onSubmitSearch } = this.props;
    const word = e.nativeEvent.text.trim();
    if (word) {
      addSearchHistory(word);
      if (onSubmitSearch) {
        onSubmitSearch(word);
      }
    }
  };

  renderSearchBar = () => {
    const {
      searchType,
      onFocus,
      onChangeText,
      autoFocus,
      word,
      i18n,
    } = this.props;
    return (
      <View style={globalStyles.container}>
        <Searchbar
          style={styles.searchBar}
          selectionColor="#90CAF9"
          placeholder={
            searchType === SEARCH_TYPES.USER
              ? i18n.searchUserPlaceholder
              : i18n.searchPlaceholder
          }
          autoFocus={autoFocus}
          onFocus={onFocus}
          onChangeText={onChangeText}
          onSubmitEditing={this.handleOnSubmitSearch}
          value={word}
          autoCorrect={false}
        />
      </View>
    );
  };

  render() {
    const {
      word,
      showBackButton,
      showMenuButton,
      headerRight,
      onPressBackButton,
      withShadow,
    } = this.props;
    return (
      <PXHeader
        headerTitle={this.renderSearchBar()}
        headerRight={headerRight}
        word={word}
        showBackButton={showBackButton}
        showMenuButton={showMenuButton}
        onPressBackButton={onPressBackButton}
        withShadow={withShadow}
        darkTheme
      />
    );
  }
}

export default connectLocalization(
  withTheme(
    withNavigation(connect(null, searchHistoryActionCreators)(PXSearchBar)),
  ),
);

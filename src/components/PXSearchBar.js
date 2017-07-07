import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { SearchBar } from 'react-native-elements';
import { connectLocalization } from './Localization';
import PXHeader from './PXHeader';
import * as searchHistoryActionCreators from '../common/actions/searchHistory';
import { SEARCH_TYPES } from '../common/constants';
import { globalStyles } from '../styles';

class PXSearchBar extends Component {
  static defaultProps = {
    searchType: SEARCH_TYPES.ILLUST,
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
      isFocus,
    } = this.props;
    return (
      <View style={globalStyles.container}>
        <SearchBar
          containerStyle={{
            backgroundColor: '#fff',
            borderTopWidth: 0,
            borderBottomWidth: 0,
          }}
          lightTheme
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
          returnKeyType="search"
          defaultValue={word}
          autoCorrect={false}
          textInputRef="searchBar"
          clearIcon={word && isFocus ? true : false} // eslint-disable-line no-unneeded-ternary
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
    } = this.props;
    return (
      <PXHeader
        headerTitle={this.renderSearchBar()}
        headerRight={headerRight}
        word={word}
        showBackButton={showBackButton}
        showMenuButton={showMenuButton}
        onPressBackButton={onPressBackButton}
      />
    );
  }
}

export default connectLocalization(
  withNavigation(connect(null, searchHistoryActionCreators)(PXSearchBar)),
);

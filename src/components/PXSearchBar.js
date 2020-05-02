import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { Searchbar } from 'react-native-paper';
import { useLocalization } from './Localization';
import PXHeader from './PXHeader';
import { addSearchHistory } from '../common/actions/searchHistory';
import { SEARCH_TYPES } from '../common/constants';
import { globalStyles } from '../styles';

const styles = StyleSheet.create({
  searchBar: {
    marginHorizontal: 5,
    ...Platform.select({
      ios: {
        height: 36,
      },
    }),
  },
});

const PXSearchBar = ({
  searchType = SEARCH_TYPES.ILLUST,
  onFocus,
  onChangeText,
  autoFocus,
  word,
  headerRight,
  showBackButton,
  showMenuButton,
  onPressBackButton,
  onSubmitSearch,
  withShadow,
}) => {
  const dispatch = useDispatch();
  const { i18n } = useLocalization();

  const handleOnSubmitSearch = (e) => {
    const searchWord = e.nativeEvent.text.trim();
    if (searchWord) {
      dispatch(addSearchHistory(searchWord));
      if (onSubmitSearch) {
        onSubmitSearch(searchWord);
      }
    }
  };

  const renderSearchBar = () => {
    return (
      <View style={globalStyles.container}>
        <Searchbar
          style={[
            styles.searchBar,
            showBackButton && {
              marginLeft: 0,
            },
          ]}
          selectionColor="#90CAF9"
          placeholder={
            searchType === SEARCH_TYPES.USER
              ? i18n.searchUserPlaceholder
              : i18n.searchPlaceholder
          }
          autoFocus={autoFocus}
          onFocus={onFocus}
          onChangeText={onChangeText}
          onSubmitEditing={handleOnSubmitSearch}
          value={word}
          autoCorrect={false}
        />
      </View>
    );
  };

  return (
    <PXHeader
      headerTitle={renderSearchBar()}
      headerRight={headerRight}
      word={word}
      showBackButton={showBackButton}
      showMenuButton={showMenuButton}
      onPressBackButton={onPressBackButton}
      withShadow={withShadow}
      darkTheme
    />
  );
};

export default PXSearchBar;

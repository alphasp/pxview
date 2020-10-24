import React, { useEffect } from 'react';
import { View, StyleSheet, InteractionManager } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { useTheme } from 'react-native-paper';
import SearchHistory from '../components/SearchHistory';
import SearchUsersAutoCompleteList from '../components/SearchUsersAutoCompleteList';
import {
  fetchSearchUsersAutoComplete,
  clearSearchUsersAutoComplete,
} from '../common/actions/searchUsersAutoComplete';
import { getSearchUsersAutoCompleteItems } from '../common/selectors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const SearchUsersAutoCompleteResult = (props) => {
  const { word, onPressItem, onPressSearchHistoryItem } = props;
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const allState = useSelector((state) => state);
  const searchUsersAutoComplete = useSelector(
    (state) => state.searchUsersAutoComplete,
  );
  const items = getSearchUsersAutoCompleteItems(allState, props);

  const loadMoreItems = () => {
    if (!searchUsersAutoComplete.loading && searchUsersAutoComplete.nextUrl) {
      dispatch(
        fetchSearchUsersAutoComplete(word, searchUsersAutoComplete.nextUrl),
      );
    }
  };

  const handleOnRefresh = () => {
    dispatch(clearSearchUsersAutoComplete());
    dispatch(fetchSearchUsersAutoComplete(word, null, true));
  };

  useEffect(() => {
    dispatch(clearSearchUsersAutoComplete());
    InteractionManager.runAfterInteractions(() => {
      if (word && word.length > 1) {
        dispatch(fetchSearchUsersAutoComplete(word));
      }
    });
  }, [dispatch, word]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {((!searchUsersAutoComplete.loaded && !searchUsersAutoComplete.loading) ||
        !word) && <SearchHistory onPressItem={onPressSearchHistoryItem} />}
      {word && word.length > 1 ? (
        <SearchUsersAutoCompleteList
          data={{ ...searchUsersAutoComplete, items }}
          onPressItem={onPressItem}
          loadMoreItems={loadMoreItems}
          onRefresh={handleOnRefresh}
          navigation={navigation}
        />
      ) : null}
    </View>
  );
};

export default SearchUsersAutoCompleteResult;

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import {
  SinglePickerMaterialDialog,
  MaterialDialog,
} from 'react-native-material-dialog';
import { connectLocalization } from './Localization';
import Loader from './Loader';
import * as searchNovelsBookmarkRangesActionCreators from '../common/actions/searchNovelsBookmarkRanges';

const styles = StyleSheet.create({
  loader: {
    margin: 10,
  },
});

class SearchNovelsBookmarkRangesPickerDialog extends Component {
  componentDidMount() {
    const {
      word,
      searchOptions,
      navigationStateKey,
      fetchSearchNovelsBookmarkRanges,
      clearSearchNovelsBookmarkRanges,
    } = this.props;
    clearSearchNovelsBookmarkRanges(navigationStateKey);
    fetchSearchNovelsBookmarkRanges(navigationStateKey, word, searchOptions);
  }

  mapItemsOptions = items => {
    const { i18n } = this.props;
    return items.map(item => {
      let value;
      let label;
      if (item.bookmark_num_min === '*' && item.bookmark_num_max === '*') {
        value = '';
        label = i18n.searchLikesAll;
      } else if (
        item.bookmark_num_min !== '*' &&
        item.bookmark_num_max === '*'
      ) {
        value = `bookmarkNumMin=${item.bookmark_num_min}`;
        label = `${item.bookmark_num_min}+`;
      } else {
        value = `bookmarkNumMin=${item.bookmark_num_min}&bookmarkNumMax=${item.bookmark_num_max}`;
        label = `${item.bookmark_num_min} - ${item.bookmark_num_max}`;
      }
      return {
        value,
        label,
      };
    });
  };

  render() {
    const {
      searchNovelsBookmarkRanges,
      i18n,
      selectedItem,
      onOk,
      onCancel,
    } = this.props;
    if (
      !searchNovelsBookmarkRanges ||
      (searchNovelsBookmarkRanges && searchNovelsBookmarkRanges.loading)
    ) {
      return (
        <MaterialDialog visible onCancel={onCancel}>
          <Loader style={styles.loader} />
        </MaterialDialog>
      );
    }
    return (
      <SinglePickerMaterialDialog
        title={i18n.searchLikes}
        items={this.mapItemsOptions(searchNovelsBookmarkRanges.items)}
        visible
        scrolled
        selectedItem={selectedItem}
        onCancel={onCancel}
        onOk={onOk}
      />
    );
  }
}

export default connectLocalization(
  connect(
    (state, props) => ({
      searchNovelsBookmarkRanges:
        state.searchNovelsBookmarkRanges[props.navigationStateKey],
    }),
    searchNovelsBookmarkRangesActionCreators,
  )(SearchNovelsBookmarkRangesPickerDialog),
);

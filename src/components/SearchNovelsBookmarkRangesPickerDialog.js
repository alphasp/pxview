import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import { connectLocalization } from './Localization';
import * as searchNovelsBookmarkRangesActionCreators from '../common/actions/searchNovelsBookmarkRanges';

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
      return <OverlaySpinner visible />;
    }
    return (
      <SinglePickerMaterialDialog
        title={i18n.searchLikes}
        items={this.mapItemsOptions(searchNovelsBookmarkRanges.items)}
        visible
        scrolled
        selectedItem={selectedItem}
        okLabel={i18n.ok}
        cancelLabel={i18n.cancel}
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

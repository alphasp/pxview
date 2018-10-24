import React, { Component } from 'react';
import { connect } from 'react-redux';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import { connectLocalization } from './Localization';
import SingleChoiceDialog from './SingleChoiceDialog';
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
      selectedItemValue,
      onPressOk,
      onPressCancel,
    } = this.props;
    if (
      !searchNovelsBookmarkRanges ||
      (searchNovelsBookmarkRanges && searchNovelsBookmarkRanges.loading)
    ) {
      return <OverlaySpinner visible />;
    }
    return (
      <SingleChoiceDialog
        title={i18n.searchLikes}
        items={this.mapItemsOptions(searchNovelsBookmarkRanges.items)}
        visible
        scrollable
        selectedItemValue={selectedItemValue}
        onPressCancel={onPressCancel}
        onPressOk={onPressOk}
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

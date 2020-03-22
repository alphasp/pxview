import React, { Component } from 'react';
import { connect } from 'react-redux';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import { connectLocalization } from './Localization';
import SingleChoiceDialog from './SingleChoiceDialog';
import * as searchIllustsBookmarkRangesActionCreators from '../common/actions/searchIllustsBookmarkRanges';

class SearchIllustsBookmarkRangesPickerDialog extends Component {
  componentDidMount() {
    const {
      word,
      searchOptions,
      navigationStateKey,
      fetchSearchIllustsBookmarkRanges,
      clearSearchIllustsBookmarkRanges,
    } = this.props;
    clearSearchIllustsBookmarkRanges(navigationStateKey);
    fetchSearchIllustsBookmarkRanges(navigationStateKey, word, searchOptions);
  }

  mapItemsOptions = (items) => {
    const { i18n } = this.props;
    return items.map((item) => {
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
      searchIllustsBookmarkRanges,
      i18n,
      selectedItemValue,
      onPressOk,
      onPressCancel,
    } = this.props;
    if (
      !searchIllustsBookmarkRanges ||
      (searchIllustsBookmarkRanges && searchIllustsBookmarkRanges.loading)
    ) {
      return <OverlaySpinner visible />;
    }
    return (
      <SingleChoiceDialog
        title={i18n.searchLikes}
        items={this.mapItemsOptions(searchIllustsBookmarkRanges.items)}
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
      searchIllustsBookmarkRanges:
        state.searchIllustsBookmarkRanges[props.navigationStateKey],
    }),
    searchIllustsBookmarkRangesActionCreators,
  )(SearchIllustsBookmarkRangesPickerDialog),
);

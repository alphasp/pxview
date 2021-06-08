/* eslint-disable camelcase */

import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import qs from 'qs';
import { withTheme, Button } from 'react-native-paper';
import { connectLocalization } from '../../components/Localization';
import PXListItem from '../../components/PXListItem';
import SingleChoiceDialog from '../../components/SingleChoiceDialog';
import SearchIllustsBookmarkRangesPickerDialog from '../../components/SearchIllustsBookmarkRangesPickerDialog';
import SearchNovelsBookmarkRangesPickerDialog from '../../components/SearchNovelsBookmarkRangesPickerDialog';
import {
  SEARCH_TYPES,
  SEARCH_PERIOD_TYPES,
  SCREENS,
} from '../../common/constants';
import { globalStyles, globalStyleVariables } from '../../styles';

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  searchFilterButtonContainer: {
    padding: 10,
  },
  searchFilterButton: {
    backgroundColor: globalStyleVariables.PRIMARY_COLOR,
    padding: 10,
    alignItems: 'center',
  },
  searchFilterButtonText: {
    color: '#fff',
  },
});

class SearchFilterModal extends Component {
  constructor(props) {
    super(props);
    const {
      searchFilter: {
        search_target,
        period,
        sort,
        start_date,
        end_date,
        bookmark_num_min,
        bookmark_num_max,
        bookmarkCountsTag,
      },
    } = props.route.params;
    this.state = {
      target: search_target || 'partial_match_for_tags',
      period: period || SEARCH_PERIOD_TYPES.ALL,
      bookmarkCountsTag: bookmarkCountsTag || '',
      sort: sort || 'date_desc',
      startDate: start_date,
      endDate: end_date,
      likes: this.getSelectedLikesFilterValue(
        bookmark_num_min,
        bookmark_num_max,
      ),
      bookmarkNumMin: bookmark_num_min,
      bookmarkNumMax: bookmark_num_max,
      selectedFilterType: null,
      selectedPickerValue: null,
      filterList: this.getFilterList(true),
    };
  }

  getFilterList = (init) => {
    const { i18n, user, route } = this.props;
    // const { startDate, endDate } = this.state;
    const {
      searchFilter: { start_date, end_date },
      searchType,
    } = route.params;
    let targetOptions;
    if (searchType === SEARCH_TYPES.ILLUST) {
      targetOptions = [
        {
          value: 'partial_match_for_tags',
          label: i18n.searchTargetTagPartial,
        },
        {
          value: 'exact_match_for_tags',
          label: i18n.searchTargetTagExact,
        },
        {
          value: 'title_and_caption',
          label: i18n.searchTargetTitleCaption,
        },
      ];
    } else {
      targetOptions = [
        {
          value: 'partial_match_for_tags',
          label: i18n.searchTargetTagPartial,
        },
        {
          value: 'exact_match_for_tags',
          label: i18n.searchTargetTagExact,
        },
        {
          value: 'text',
          label: i18n.searchTargetText,
        },
        {
          value: 'keyword',
          label: i18n.searchTargetKeyword,
        },
      ];
    }
    const bookmarkCountsTagOptions = [
      {
        value: '',
        label: i18n.searchBookmarkCountsTagAll,
      },
      {
        value: '100users入り',
        label: '100users入り',
      },
      {
        value: '500users入り',
        label: '500users入り',
      },
      {
        value: '1000users入り',
        label: '1000users入り',
      },
      {
        value: '5000users入り',
        label: '5000users入り',
      },
      {
        value: '10000users入り',
        label: '10000users入り',
      },
      {
        value: '30000users入り',
        label: '30000users入り',
      },
      {
        value: '50000users入り',
        label: '50000users入り',
      },
      {
        value: '100000users入り',
        label: '100000users入り',
      },
    ];
    const extraPeriodOption = {};
    if (init) {
      if (start_date && end_date) {
        extraPeriodOption.value = SEARCH_PERIOD_TYPES.CUSTOM_DATE;
        extraPeriodOption.label = `${start_date} - ${end_date}`;
      }
    } else if (this.state.startDate && this.state.endDate) {
      extraPeriodOption.value = SEARCH_PERIOD_TYPES.CUSTOM_DATE;
      extraPeriodOption.label = `${this.state.startDate} - ${this.state.endDate}`;
    }
    let periodOptions = [
      {
        value: SEARCH_PERIOD_TYPES.ALL,
        label: i18n.searchPeriodAll,
      },
      {
        value: SEARCH_PERIOD_TYPES.LAST_DAY,
        label: i18n.searchPeriodLastDay,
      },
      {
        value: SEARCH_PERIOD_TYPES.LAST_WEEK,
        label: i18n.searchPeriodLastWeek,
      },
      {
        value: SEARCH_PERIOD_TYPES.LAST_MONTH,
        label: i18n.searchPeriodLastMonth,
      },
      {
        value: SEARCH_PERIOD_TYPES.LAST_HALF_YEAR,
        label: i18n.searchPeriodLastHalfYear,
      },
      {
        value: SEARCH_PERIOD_TYPES.LAST_YEAR,
        label: i18n.searchPeriodLastYear,
      },
      {
        value: SEARCH_PERIOD_TYPES.DATE,
        label: i18n.searchPeriodSpecifyDate,
      },
    ];
    if (extraPeriodOption.value) {
      periodOptions = [extraPeriodOption, ...periodOptions];
    }
    const filterOptions = [
      {
        key: 'target',
        options: targetOptions,
      },
      {
        key: 'period',
        options: periodOptions,
      },
      {
        key: 'bookmarkCountsTag',
        options: bookmarkCountsTagOptions,
      },
      {
        key: 'sort',
        options: [
          {
            value: 'date_desc',
            label: i18n.searchOrderNewest,
          },
          {
            value: 'date_asc',
            label: i18n.searchOrderOldest,
          },
          {
            value: 'popularity',
            label: i18n.searchOrderPopularity,
          },
        ],
      },
    ];
    if (user.is_premium) {
      filterOptions.push({
        key: 'likes',
        options: [
          {
            value: null,
            label: i18n.searchLikesAll,
          },
        ],
      });
    }
    return filterOptions;
  };

  getSearchTypeName = (type) => {
    const { i18n } = this.props;
    switch (type) {
      case 'target':
        return i18n.searchTarget;
      case 'bookmarkCountsTag':
        return i18n.searchBookmarkCountsTag;
      case 'period':
        return i18n.searchPeriod;
      case 'sort':
        return i18n.searchOrder;
      case 'likes':
        return i18n.searchLikes;
      default:
        return '';
    }
  };

  getSelectedFilterName = (key, options) => {
    if (key !== 'likes') {
      return options.find((o) => o.value === this.state[key]).label;
    }
    const { bookmarkNumMin, bookmarkNumMax } = this.state;
    if (!bookmarkNumMin && !bookmarkNumMax) {
      const { i18n } = this.props;
      return i18n.searchLikesAll;
    }
    if (!bookmarkNumMax) {
      return `${bookmarkNumMin}+`;
    }
    return `${bookmarkNumMin} - ${bookmarkNumMax}`;
  };

  getSelectedLikesFilterValue = (bookmarkNumMin, bookmarkNumMax) => {
    if (!bookmarkNumMin && !bookmarkNumMax) {
      return '';
    }
    if (!bookmarkNumMax) {
      return `bookmarkNumMin=${bookmarkNumMin}`;
    }
    return `bookmarkNumMin=${bookmarkNumMin}&bookmarkNumMax=${bookmarkNumMax}`;
  };

  handleOnPressFilterOption = (filterType) => {
    const value = this.state[filterType];
    this.setState({
      selectedFilterType: filterType,
      selectedPickerValue: value,
    });
  };

  handleOnOkPickerDialog = (value) => {
    const { selectedFilterType, startDate, endDate } = this.state;
    if (selectedFilterType === 'period') {
      if (value === SEARCH_PERIOD_TYPES.DATE) {
        const { navigate } = this.props.navigation;
        navigate(SCREENS.SearchFilterPeriodDateModal, {
          onConfirmPeriodDate: this.handleOnConfirmPeriodDate,
          startDate,
          endDate,
        });
        this.setState({
          selectedFilterType: null,
        });
      } else {
        this.setState({
          [selectedFilterType]: value,
          selectedPickerValue: value,
          selectedFilterType: null,
          startDate: null,
          endDate: null,
        });
      }
    } else {
      const newState = {
        [selectedFilterType]: value,
        selectedPickerValue: value,
        selectedFilterType: null,
      };
      if (selectedFilterType === 'likes') {
        if (value) {
          const { bookmarkNumMin, bookmarkNumMax } = qs.parse(value);
          newState.bookmarkNumMin = bookmarkNumMin;
          newState.bookmarkNumMax = bookmarkNumMax;
        } else {
          newState.bookmarkNumMin = null;
          newState.bookmarkNumMax = null;
        }
      }
      this.setState(newState);
    }
  };

  handleOnCancelPickerDialog = () => {
    this.setState({
      selectedFilterType: null,
    });
  };

  handleOnConfirmPeriodDate = (startDate, endDate) => {
    const { goBack } = this.props.navigation;
    goBack(null);
    this.setState(
      {
        startDate,
        endDate,
      },
      () => {
        this.setState({
          filterList: this.getFilterList(),
          period: SEARCH_PERIOD_TYPES.CUSTOM_DATE,
          selectedPickerValue: SEARCH_PERIOD_TYPES.CUSTOM_DATE,
        });
      },
    );
  };

  handleOnPressApplyFilter = () => {
    const {
      navigation: { navigate },
    } = this.props;
    const {
      target,
      period,
      sort,
      startDate,
      endDate,
      bookmarkNumMin,
      bookmarkNumMax,
      bookmarkCountsTag,
    } = this.state;
    navigate(SCREENS.SearchResult, {
      target,
      period,
      sort,
      startDate,
      endDate,
      bookmarkNumMin,
      bookmarkNumMax,
      bookmarkCountsTag,
    });
  };

  render() {
    const { i18n, navigationStateKey, route, theme } = this.props;
    const { word, searchType } = route.params;
    const {
      selectedFilterType,
      selectedPickerValue,
      filterList,
      searchTarget,
      period,
      startDate,
      endDate,
    } = this.state;
    return (
      <SafeAreaView
        style={[
          globalStyles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <View style={styles.listContainer}>
          {filterList.map((list) => (
            <PXListItem
              key={list.key}
              title={this.getSearchTypeName(list.key)}
              description={this.getSelectedFilterName(list.key, list.options)}
              onPress={() => this.handleOnPressFilterOption(list.key)}
            />
          ))}
        </View>
        <View style={styles.searchFilterButtonContainer}>
          <Button mode="contained" onPress={this.handleOnPressApplyFilter}>
            {i18n.searchApplyFilter}
          </Button>
        </View>
        {selectedFilterType && selectedFilterType !== 'likes' && (
          <SingleChoiceDialog
            title={this.getSearchTypeName(selectedFilterType)}
            items={filterList
              .find((f) => f.key === selectedFilterType)
              .options.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
            visible
            scrollable
            selectedItemValue={selectedPickerValue}
            onPressCancel={this.handleOnCancelPickerDialog}
            onPressOk={this.handleOnOkPickerDialog}
          />
        )}
        {selectedFilterType === 'likes' && searchType === SEARCH_TYPES.ILLUST && (
          <SearchIllustsBookmarkRangesPickerDialog
            navigationStateKey={navigationStateKey}
            word={word}
            searchOptions={{
              search_target: searchTarget,
              period,
              start_date: startDate,
              end_date: endDate,
            }}
            selectedItemValue={selectedPickerValue}
            onPressCancel={this.handleOnCancelPickerDialog}
            onPressOk={this.handleOnOkPickerDialog}
          />
        )}
        {selectedFilterType === 'likes' && searchType === SEARCH_TYPES.NOVEL && (
          <SearchNovelsBookmarkRangesPickerDialog
            navigationStateKey={navigationStateKey}
            word={word}
            searchOptions={{
              search_target: searchTarget,
              period,
              start_date: startDate,
              end_date: endDate,
            }}
            selectedItemValue={selectedPickerValue}
            onPressCancel={this.handleOnCancelPickerDialog}
            onPressOk={this.handleOnOkPickerDialog}
          />
        )}
      </SafeAreaView>
    );
  }
}

export default withTheme(
  connectLocalization(
    connect((state, props) => ({
      user: state.auth.user,
      navigationStateKey: props.route.key,
    }))(SearchFilterModal),
  ),
);

import React, { Component } from 'react';
import { StyleSheet, Text, View, SectionList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connectLocalization } from './Localization';
import PXTouchable from './PXTouchable';
import Separator from './Separator';
import { globalStyles, globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
  },
  sectionHeaderTitle: {
    fontWeight: 'bold',
    padding: 10,
  },
  row: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchFilterButtonContainer: {
    padding: 10,
    backgroundColor: '#fff',
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

const sections = [
  {
    key: 'target',
    data: [
      {
        value: 'partial_match_for_tags',
        type: 'target',
      },
      {
        value: 'exact_match_for_tags',
        type: 'target',
      },
      {
        value: 'title_and_caption',
        type: 'target',
      },
    ],
  },
  {
    key: 'duration',
    data: [
      {
        value: '',
        type: 'duration',
      },
      {
        value: 'within_last_day',
        type: 'duration',
      },
      {
        value: 'within_last_week',
        type: 'duration',
      },
      {
        value: 'within_last_month',
        type: 'duration',
      },
    ],
  },
  {
    key: 'sort',
    data: [
      {
        value: 'date_desc',
        type: 'sort',
      },
      {
        value: 'date_asc',
        type: 'sort',
      },
    ],
  },
];

class SearchFilterModal extends Component {
  constructor(props) {
    super(props);
    const {
      searchFilter: { target, duration, sort },
    } = props.navigation.state.params;
    this.state = {
      target: target || 'partial_match_for_tags',
      duration: duration || '',
      sort: sort || 'date_desc',
    };
  }

  getSearchTypeName = type => {
    const { i18n } = this.props;
    switch (type) {
      case 'target':
        return i18n.searchTarget;
      case 'duration':
        return i18n.searchDuration;
      case 'sort':
        return i18n.searchOrder;
      default:
        return '';
    }
  };

  getSearchOptionName = option => {
    const { i18n } = this.props;
    switch (option) {
      case 'partial_match_for_tags':
        return i18n.searchTargetTagPartial;
      case 'exact_match_for_tags':
        return i18n.searchTargetTagTotal;
      case 'title_and_caption':
        return i18n.searchTargetTitleCaption;
      case '':
        return i18n.searchDurationNothing;
      case 'within_last_day':
        return i18n.searchDurationLastDay;
      case 'within_last_week':
        return i18n.searchDurationLastWeek;
      case 'within_last_month':
        return i18n.searchDurationLastMonth;
      case 'date_desc':
        return i18n.searchOrderNewest;
      case 'date_asc':
        return i18n.searchOrderOldest;
      default:
        return '';
    }
  };

  renderSectionHeader = ({ section }) => (
    <View key={section.key} style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderTitle}>
        {this.getSearchTypeName(section.key)}
      </Text>
    </View>
  );

  renderItem = ({ item }) => {
    const { target, duration, sort } = this.state;
    return (
      <PXTouchable onPress={() => this.handleOnPressRow(item.type, item.value)}>
        <View style={styles.row}>
          <Text>{this.getSearchOptionName(item.value)}</Text>
          {((item.type === 'target' && item.value === target) ||
            (item.type === 'duration' && item.value === duration) ||
            (item.type === 'sort' && item.value === sort)) &&
            <Icon name="check" color={globalStyleVariables.PRIMARY_COLOR} />}
        </View>
      </PXTouchable>
    );
  };

  renderSeparator = (sectionId, rowId) => (
    <Separator key={`${sectionId}-${rowId}`} />
  );

  handleOnPressRow = (filterType, value) => {
    if (filterType === 'target') {
      this.setState({ target: value });
    } else if (filterType === 'duration') {
      this.setState({ duration: value });
    } else if (filterType === 'sort') {
      this.setState({ sort: value });
    }
  };

  render() {
    const { i18n, navigation } = this.props;
    const { onPressApplyFilter } = navigation.state.params;
    const { target, duration, sort } = this.state;
    return (
      <View style={globalStyles.container}>
        <SectionList
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          ItemSeparatorComponent={this.renderSeparator}
          keyExtractor={item => item.value}
          sections={sections}
          initialNumToRender={12}
        />
        <View style={styles.searchFilterButtonContainer}>
          <PXTouchable
            onPress={() => onPressApplyFilter(target, duration, sort)}
            style={styles.searchFilterButton}
          >
            <Text style={styles.searchFilterButtonText}>
              {i18n.searchApplyFilter}
            </Text>
          </PXTouchable>
        </View>
      </View>
    );
  }
}

export default connectLocalization(SearchFilterModal);

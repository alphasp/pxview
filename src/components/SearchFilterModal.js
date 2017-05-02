import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Platform,
  Dimensions,
  Button,
  SectionList,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import PXTouchable from './PXTouchable';
import Separator from './Separator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    backgroundColor: '#E9EBEE',
  },
  sectionHeaderTitle: {
    fontWeight: 'bold',
    // fontSize: 20,
    padding: 10,
  },
  row: {
    // borderBottomWidth: 1,
    // borderBottomColor: '#000',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separatorContainer: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
    // paddingLeft: 10,
    // paddingRight: 10
  },
  searchFilterButtonContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  searchFilterButton: {
    backgroundColor: '#5cafec',
    padding: 10,
    alignItems: 'center',
    //margin: 10,
  },
  searchFilterButtonText: {
    color: '#fff',
  },
});


const typeName = {
  target: 'Target',
  duration: 'Duration',
  sort: 'Sort By',
};

const sections = [{
  key: 'target',
  data: [{
    name: 'Tag Partial',
    value: 'partial_match_for_tags',
    type: 'target',
  },
  {
    name: 'Tag Total',
    value: 'exact_match_for_tags',
    type: 'target',
  },
  {
    name: 'Title caption',
    value: 'title_and_caption',
    type: 'target',
  }],
},
{
  key: 'duration',
  data: [{
    name: 'Nothing',
    value: '',
    type: 'duration',
  },
  {
    name: 'Last Day',
    value: 'within_last_day',
    type: 'duration',
  },
  {
    name: 'Last Week',
    value: 'within_last_week',
    type: 'duration',
  },
  {
    name: 'Last Month',
    value: 'within_last_month',
    type: 'duration',
  }],
},
{
  key: 'sort',
  data: [{
    name: 'Newest',
    value: 'date_desc',
    type: 'sort',
  },
  {
    name: 'Oldest',
    value: 'date_asc',
    type: 'sort',
  }],
}];

class SearchFilterModal extends Component {
  constructor(props) {
    super(props);
    const { searchFilter: { target, duration, sort } } = props.navigation.state.params;
    this.state = {
      target: target || 'partial_match_for_tags',
      duration: duration || '',
      sort: sort || 'date_desc',
    };
  }
  renderSectionHeader = ({ section }) => (
    <View key={section.key} style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderTitle}>
        {typeName[section.key]}
      </Text>
    </View>
    )

  renderItem = ({ item }) => {
    console.log('item ', item);
    const { target, duration, sort } = this.state;
    return (
      <PXTouchable
        onPress={() => this.handleOnPressRow(item.type, item.value)}
      >
        <View style={styles.row}>
          <Text>{item.name}</Text>
          {
            ((item.type === 'target' && item.value === target) ||
            (item.type === 'duration' && item.value === duration) ||
            (item.type === 'sort' && item.value === sort)) &&
            <Icon
              name="check"
              color="#2196F3"
            />
          }
        </View>
      </PXTouchable>
    );
  }

  renderSeparator = (sectionId, rowId) => (
    <Separator key={`${sectionId}-${rowId}`} />
    )

  handleOnPressRow = (filterType, value) => {
    console.log(filterType, value);
    if (filterType === 'target') {
      this.setState({ target: value });
    }
    else if (filterType === 'duration') {
      this.setState({ duration: value });
    }
    else if (filterType === 'sort') {
      this.setState({ sort: value });
    }
  }

  render() {
    const { onPressApplyFilter } = this.props.navigation.state.params;
    const { target, duration, sort } = this.state;
    return (
      <View style={styles.container}>
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
            <Text style={styles.searchFilterButtonText}>Apply Search Duration</Text>
          </PXTouchable>
        </View>
      </View>
    );
  }
}

export default SearchFilterModal;

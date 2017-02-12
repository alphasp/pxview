import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Platform,
  Dimensions,
  Button,
} from 'react-native';
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import PXTouchable from './PXTouchable';
import Separator from './Separator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 10
    // position: "absolute",
    // top:0,
    // bottom:0,
    // left:0,
    // right:0,
    // backgroundColor:"transparent",
    // justifyContent: "center",
    // alignItems: "center",
  },
  content: {
    flex: 0.8
  },
  footer: {
    flex: 0.2
  },
  sectionHeader: {
    backgroundColor: '#E9EBEE',
  },
  sectionHeaderTitle: {
    fontWeight: "bold", 
    // fontSize: 20,
    padding: 10
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
    paddingRight: 10
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
  target: "Target",
  duration: "Duration"
}
const data = {
  target: [
    {
      name: "Tag Partial",
      value: "partial_match_for_tags",
      type: "target",
    },
    {
      name: "Tag Total",
      value: "exact_match_for_tags",
      type: "target"
    },
    {
      name: "Title caption",
      value: "title_and_caption",
      type: "target"  
    },
  ],
  duration: [
    {
      name: "Nothing",
      value: "",
      type: "duration"
    },
    {
      name: "Last Day",
      value: "within_last_day",
      type: "duration"
    },
    {
      name: "Last Week",
      value: "within_last_week",
      type: "duration"
    },
    {
      name: "Last Month",
      value: "within_last_month",
      type: "duration"
    }
  ]
}

class SearchFilterModal extends Component {
  constructor(props) {
    super(props);
    console.log('sf ', props)
    const { searchFilter: { target, duration } } = props.navigation.state.params;
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1,s2) => s1 !== s2
    })
    this.state = {
      target: target || 'partial_match_for_tags',
      duration: duration || ''
    };
  }
  renderSectionHeader = (sectionData, type) => {
    return (
      <View key={type} style={ styles.sectionHeader }>
        <Text style={ styles.sectionHeaderTitle }>
          { typeName[type] }
        </Text>
      </View>
    )
  }

  renderRow = (item) => {
    const { target, duration } = this.state;
    return (
      <PXTouchable 
        key={item.id} 
        onPress={() => this.handleOnPressRow(item.type, item.value)}
      >
        <View style={styles.row}>
          <Text>{item.name}</Text>
          {
            item.type === "target" &&
            item.value === target &&
            <Icon 
              name="check"
              color="#2196F3" 
            />
          }
          {
            item.type === "duration" &&
            item.value === duration &&
            <Icon 
              name="check"
              color="#2196F3" 
            />
          }
        </View>
      </PXTouchable>
    )
  }

  renderSeparator = (sectionId, rowId) => {
    return (
      <Separator key={`${sectionId}-${rowId}`} />
    )
  }

  handleOnPressRow = (filterType, value) => {
    console.log(filterType, value)
    if (filterType === 'target') {
      this.setState({ target: value });
    }
    else if (filterType === 'duration') {
      this.setState({ duration: value });
    }
  }

  render() {
    const { onPressApplyFilter } = this.props.navigation.state.params;
    const { target, duration } = this.state;
    const dataSource = this.dataSource.cloneWithRowsAndSections(data);
    return (
      <View style={styles.container}>
        <ListView
          dataSource={dataSource}
          renderRow={this.renderRow}
          renderSectionHeader={this.renderSectionHeader}
          renderSeparator={this.renderSeparator}
          keyboardShouldPersistTaps="always"
        />  
        <View style={styles.searchFilterButtonContainer}>
          <PXTouchable 
            onPress={() => onPressApplyFilter(target, duration)}
            style={styles.searchFilterButton}
          >
            <Text style={styles.searchFilterButtonText}>Apply Search Duration</Text>
          </PXTouchable> 
        </View>
      </View>
    )
  }
}

export default SearchFilterModal;
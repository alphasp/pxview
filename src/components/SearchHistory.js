import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  Animated,
  ListView,
} from 'react-native';
import dismissKeyboard from 'dismissKeyboard';
import Icon from 'react-native-vector-icons/FontAwesome';
import PXTouchable from './PXTouchable';
import Separator from './Separator';

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  row: {
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
  },
  searchHistoryContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchHistoryTitle: {
    fontWeight: 'bold',
  },
});

class SearchHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      })
    };
  }

  componentDidMount() {
    const { items } = this.props;
    const { dataSource } = this.state;
    this.setState({
      dataSource: dataSource.cloneWithRows(items)
    });
  }

  componentWillReceiveProps(nextProps) {
    const { items: prevItems } = this.props;
    const { items } = nextProps;
    if (items !== prevItems) {
      const { dataSource } = this.state;
      this.setState({
        dataSource: dataSource.cloneWithRows(items)
      });
    }
  }

  renderRow = (item) => {
    const { onPressItem, onPressRemoveSearchHistoryItem } = this.props;
    return (
      <PXTouchable 
        key={item} 
        onPress={() => onPressItem(item)}
      >
        <View style={styles.row}>
          <Text>{item}</Text>
          <Icon name="times" size={16} color="#A9A9A9" onPress={() => onPressRemoveSearchHistoryItem(item)} />
        </View>
      </PXTouchable>
    )
  }

  renderSeparator = (sectionId, rowId) => {
    return (
      <Separator key={`${sectionId}-${rowId}`} />
    )
  }

  render() {
    const { items, onPressRemoveClearSearchHistory } = this.props;
    const { dataSource } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.searchHistoryContainer}>
          <Text style={styles.searchHistoryTitle}>Search history</Text>
          <PXTouchable onPress={onPressRemoveClearSearchHistory}>
            <Text style={styles.searchHistoryTitle}>CLEAR ALL</Text>
          </PXTouchable>
        </View>
        {
          (items && items.length) ?
          <ListView 
            dataSource={dataSource}
            renderRow={this.renderRow}
            renderSeparator={this.renderSeparator}
            enableEmptySections={true}
            keyboardShouldPersistTaps={true}
            onScroll={dismissKeyboard}
          />
          :
          null
        }
      </View>
    );
  }
}

export default SearchHistory;

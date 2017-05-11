import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PXTouchable from './PXTouchable';
import Separator from './Separator';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  listItemContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchHistoryContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchHistoryTitle: {
    fontWeight: 'bold',
  },
  searchHistoryText: {
    width: globalStyleVariables.WINDOW_WIDTH - 45,
  },
});

class SearchHistory extends Component {
  renderItem = ({ item }) => {
    const { onPressItem, onPressRemoveSearchHistoryItem } = this.props;
    return (
      <View style={styles.listItemContainer} key={item}>
        <PXTouchable
          onPress={() => onPressItem(item)}
          style={styles.searchHistoryText}
        >
          <Text>{item}</Text>
        </PXTouchable>
        <Icon
          name="times"
          size={16}
          color="#A9A9A9"
          onPress={() => onPressRemoveSearchHistoryItem(item)}
        />
      </View>
    );
  };

  render() {
    const { items, onPressClearSearchHistory } = this.props;
    return (
      <View>
        <View style={styles.searchHistoryContainer}>
          <Text style={styles.searchHistoryTitle}>Search History</Text>
          <PXTouchable onPress={onPressClearSearchHistory}>
            <Text style={styles.searchHistoryTitle}>CLEAR ALL</Text>
          </PXTouchable>
        </View>
        <FlatList
          data={items}
          keyExtractor={item => item}
          renderItem={this.renderItem}
          ItemSeparatorComponent={Separator}
          keyboardShouldPersistTaps="always"
          onScroll={Keyboard.dismiss}
        />
      </View>
    );
  }
}

export default SearchHistory;

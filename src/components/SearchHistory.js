import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  Animated,
  FlatList,
  Dimensions,
} from 'react-native';
import dismissKeyboard from 'dismissKeyboard';
import Icon from 'react-native-vector-icons/FontAwesome';
import PXTouchable from './PXTouchable';
import Separator from './Separator';

const styles = StyleSheet.create({
  listItemContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separatorContainer: {
    paddingLeft: 10, 
    paddingRight: 10
  },
  separator: {
    //flex: 1,
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
  searchHistoryText: {
    width: Dimensions.get('window').width - 45,
  }
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
    )
  }

  render() {
    const { items, onPressClearSearchHistory } = this.props;
    return (
      <View>
        <View style={styles.searchHistoryContainer}>
          <Text style={styles.searchHistoryTitle}>Search history</Text>
          <PXTouchable onPress={onPressClearSearchHistory}>
            <Text style={styles.searchHistoryTitle}>CLEAR ALL</Text>
          </PXTouchable>
        </View>
        <FlatList
          data={items}
          keyExtractor={(item, index) => item}
          renderItem={this.renderItem}
          ItemSeparatorComponent={Separator}
          keyboardShouldPersistTaps="always"
        />
      </View>
    );
  }
}

export default SearchHistory;
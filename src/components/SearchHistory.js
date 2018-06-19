import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connectLocalization } from './Localization';
import PXTouchable from './PXTouchable';
import Separator from './Separator';
import { globalStyles, globalStyleVariables } from '../styles';

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
          hitSlop={{ top: 20, left: 20, bottom: 20, right: 0 }}
          onPress={() => onPressItem(item)}
          style={styles.searchHistoryText}
        >
          <Text>
            {item}
          </Text>
        </PXTouchable>
        <PXTouchable
          hitSlop={{ top: 0, left: 20, bottom: 20, right: 20 }}
          onPress={() => onPressRemoveSearchHistoryItem(item)}
        >
          <Icon name="times" size={16} color="#A9A9A9" />
        </PXTouchable>
      </View>
    );
  };

  render() {
    const { items, onPressClearSearchHistory, i18n } = this.props;
    return (
      <View style={globalStyles.container}>
        <View style={styles.searchHistoryContainer}>
          <Text style={styles.searchHistoryTitle}>
            {i18n.searchHistory}
          </Text>
          <PXTouchable
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            onPress={onPressClearSearchHistory}
          >
            <Text style={styles.searchHistoryTitle}>
              {i18n.searchHistoryClear}
            </Text>
          </PXTouchable>
        </View>
        <FlatList
          data={items}
          keyExtractor={item => item}
          renderItem={this.renderItem}
          ItemSeparatorComponent={Separator}
          keyboardShouldPersistTaps="always"
          removeClippedSubviews={false} // to prevent flatlist hidden after switch language
          onScroll={Keyboard.dismiss}
        />
      </View>
    );
  }
}

export default connectLocalization(SearchHistory);

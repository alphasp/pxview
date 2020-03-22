import React, { PureComponent } from 'react';
import { View, StyleSheet, FlatList, Keyboard } from 'react-native';
import { Text, Caption } from 'react-native-paper';
import { connectLocalization } from './Localization';
import PXTouchable from './PXTouchable';
import Loader from './Loader';
import Separator from './Separator';
import { globalStyles } from '../styles';

const styles = StyleSheet.create({
  row: {
    padding: 10,
    flexDirection: 'column',
  },
  searchAutoCompleteHeaderContainer: {
    padding: 10,
  },
  searchAutoCompleteTitle: {
    fontWeight: 'bold',
  },
});

class SearchAutoCompleteList extends PureComponent {
  renderItem = ({ item }) => {
    const { onPressItem } = this.props;
    // TODO - to fix on scroll trigger onPress event
    return (
      <PXTouchable onPress={() => onPressItem(item.name)}>
        <View style={styles.row}>
          <Text>{item.name}</Text>
          {item.translated_name && <Caption>{item.translated_name}</Caption>}
        </View>
      </PXTouchable>
    );
  };

  render() {
    const {
      data: { items, loading, loaded },
      i18n,
    } = this.props;
    return (
      <View style={globalStyles.container}>
        <View style={styles.searchAutoCompleteHeaderContainer}>
          <Text style={styles.searchAutoCompleteTitle}>
            {i18n.searchSuggest}
          </Text>
        </View>
        {!loaded && loading && <Loader />}
        {items && items.length ? (
          <FlatList
            data={items}
            keyExtractor={(item) => item.name}
            renderItem={this.renderItem}
            ItemSeparatorComponent={Separator}
            keyboardShouldPersistTaps="always"
            removeClippedSubviews={false} // to prevent flatlist hidden after switch language
            onScroll={Keyboard.dismiss}
          />
        ) : null}
      </View>
    );
  }
}

export default connectLocalization(SearchAutoCompleteList);

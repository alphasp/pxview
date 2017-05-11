import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, FlatList, Keyboard } from 'react-native';
import PXTouchable from './PXTouchable';
import Loader from './Loader';
import Separator from './Separator';
import { globalStyles, globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  row: {
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
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
  },
});

class SearchAutoCompleteList extends PureComponent {
  renderItem = ({ item }) => {
    const { onPressItem } = this.props;
    return (
      <PXTouchable key={item} onPress={() => onPressItem(item)}>
        <View style={styles.row}>
          <Text>{item}</Text>
        </View>
      </PXTouchable>
    );
  };

  render() {
    const { data: { items, loading, loaded } } = this.props;
    return (
      <View style={globalStyles.container}>
        {!loaded && loading && <Loader />}
        {items && items.length
          ? <FlatList
              data={items}
              keyExtractor={item => item}
              renderItem={this.renderItem}
              ItemSeparatorComponent={Separator}
              keyboardShouldPersistTaps="always"
              onScroll={Keyboard.dismiss}
            />
          : null}
      </View>
    );
  }
}

export default SearchAutoCompleteList;

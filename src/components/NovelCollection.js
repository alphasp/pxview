import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import NovelList from './NovelList';
import PXTouchable from './PXTouchable';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
    margin: 10,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  total: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  chevronIcon: {
    marginLeft: 5,
  },
});

const NovelCollection = props => {
  const {
    items,
    title,
    total,
    viewMoreTitle,
    maxItems,
    onPressViewMore,
  } = props;
  if (!items || !items.length) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text>
          {title}
        </Text>
        <PXTouchable onPress={onPressViewMore}>
          <View style={styles.viewAllContainer}>
            {total &&
              <Text style={styles.total}>
                {total}
              </Text>}
            <Text>
              {viewMoreTitle}
            </Text>
            <Icon name="chevron-right" style={styles.chevronIcon} />
          </View>
        </PXTouchable>
      </View>
      <NovelList
        data={{ loading: false, loaded: true, refreshing: false, items }}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
        maxItems={maxItems}
      />
    </View>
  );
};

export default NovelCollection;

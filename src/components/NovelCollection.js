import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withTheme, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import NovelList from './NovelList';
import PXTouchable from './PXTouchable';

const styles = StyleSheet.create({
  container: {
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
    theme,
  } = props;
  if (!items || !items.length) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text>{title}</Text>
        <PXTouchable
          onPress={onPressViewMore}
          hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
        >
          <View style={styles.viewAllContainer}>
            {total && <Text style={styles.total}>{total}</Text>}
            <Text>{viewMoreTitle}</Text>
            <Icon
              name="chevron-right"
              style={styles.chevronIcon}
              color={theme.colors.text}
            />
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

export default withTheme(NovelCollection);

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withTheme, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import IllustItem from './IllustItem';
import PXTouchable from './PXTouchable';
import { SCREENS } from '../common/constants';

const ILLUST_COLUMNS = 3;
const CONTAINER_MARGIN = 10;

const styles = StyleSheet.create({
  container: {
    margin: CONTAINER_MARGIN,
  },
  imagePreviews: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
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

const IllustCollection = (props) => {
  const {
    navigation: { push },
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
  const illusts = items.slice(0, maxItems || 6);
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
      <View style={styles.imagePreviews}>
        {illusts && illusts.length
          ? illusts.map((item, index) => (
              <IllustItem
                key={item.id}
                illustId={item.id}
                index={index}
                numColumns={ILLUST_COLUMNS}
                onPressItem={() =>
                  push(SCREENS.Detail, { items: illusts, index })
                }
                parentContainerMargin={CONTAINER_MARGIN}
              />
            ))
          : null}
      </View>
    </View>
  );
};

export default withTheme(IllustCollection);

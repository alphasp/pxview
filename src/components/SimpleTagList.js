import React, { Fragment, forwardRef } from 'react';
import { StyleSheet, View, RefreshControl, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTheme, Text, Caption } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Loader from './Loader';
import PXTouchable from './PXTouchable';
import Separator from './Separator';
import { SCREENS } from '../common/constants';
import { addSearchHistory } from '../common/actions/searchHistory';
import { globalStyles } from '../styles';

const styles = StyleSheet.create({
  row: {
    padding: 10,
    flexDirection: 'column',
  },
});
const SimpleTagList = forwardRef(
  (
    {
      data: { items, loading, loaded, refreshing },
      onRefresh,

      searchType,
    },
    ref,
  ) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const navigation = useNavigation();

    const handleOnPressItem = (item) => {
      dispatch(addSearchHistory(item.tag));
      navigation.push(SCREENS.SearchResult, {
        word: item.tag,
        searchType,
      });
    };
    return (
      <View
        style={[
          globalStyles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        {(!items || (!loaded && loading)) && <Loader />}
        {items && items.length ? (
          <ScrollView
            ref={ref}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {items.map((item, index) => {
              return (
                <Fragment key={item.tag}>
                  <PXTouchable
                    key={item.tag}
                    onPress={() => handleOnPressItem(item)}
                  >
                    <View style={styles.row}>
                      <Text>#{item.tag}</Text>
                      {item.translated_name && (
                        <Caption>{item.translated_name}</Caption>
                      )}
                    </View>
                  </PXTouchable>
                  {index < items.length - 1 && <Separator />}
                </Fragment>
              );
            })}
          </ScrollView>
        ) : null}
      </View>
    );
  },
);

export default SimpleTagList;

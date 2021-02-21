import React, { forwardRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import Loader from './Loader';
import PXTouchable from './PXTouchable';
import PXImage from './PXImage';
import { SCREENS } from '../common/constants';
import { addSearchHistory } from '../common/actions/searchHistory';
import { globalStyles, globalStyleVariables } from '../styles';

const ILLUST_COLUMNS = 3;

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  tag: {
    backgroundColor: 'transparent',
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  translatedTag: {
    backgroundColor: 'transparent',
    color: '#fff',
    textAlign: 'center',
    fontSize: 10,
  },
  imageContainer: {
    marginBottom: 1,
  },
  image: {
    resizeMode: 'cover',
  },
});

const TagList = forwardRef(
  (
    { searchType, data: { items, loading, loaded, refreshing }, onRefresh },
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

    const renderItem = (item, index) => {
      let imageContainerStyle = {};
      let imageStyle = {};
      let tagContainerStyle = {};
      if (index === 0) {
        const width = globalStyleVariables.WINDOW_WIDTH;
        const height =
          (globalStyleVariables.WINDOW_WIDTH / ILLUST_COLUMNS) * 2 - 1;
        imageContainerStyle = {
          width,
          height,
        };
        imageStyle = {
          width,
          height,
        };
        tagContainerStyle = {
          width,
          height,
        };
      } else {
        const width = globalStyleVariables.WINDOW_WIDTH / ILLUST_COLUMNS - 1;
        const height = globalStyleVariables.WINDOW_WIDTH / ILLUST_COLUMNS - 1;
        imageContainerStyle = {
          marginRight: index % ILLUST_COLUMNS ? 1 : 0,
          width,
          height,
        };
        imageStyle = {
          width,
          height,
        };
        tagContainerStyle = {
          height: globalStyleVariables.WINDOW_WIDTH / 3 - 1,
          width: globalStyleVariables.WINDOW_WIDTH / 3 - 1,
        };
      }
      return (
        <PXTouchable
          style={[
            styles.imageContainer,
            { backgroundColor: theme.colors.surface },
            imageContainerStyle,
          ]}
          key={item.tag}
          onPress={() => handleOnPressItem(item)}
        >
          <View>
            <PXImage
              uri={item.illust.image_urls.square_medium}
              style={[styles.image, imageStyle]}
            />
            <View style={[styles.tagContainer, tagContainerStyle]}>
              <Text style={styles.tag}>#{item.tag}</Text>
              {item.translated_name && (
                <Text style={styles.translatedTag}>{item.translated_name}</Text>
              )}
            </View>
          </View>
        </PXTouchable>
      );
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
            contentContainerStyle={styles.contentContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {items.map(renderItem)}
          </ScrollView>
        ) : null}
      </View>
    );
  },
);

export default TagList;

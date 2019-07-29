import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PXTouchable from './PXTouchable';
import PXImage from './PXImage';
import OverlayNovelPages from './OverlayNovelPages';
import OverlayBookmarkNovelButton from './OverlayBookmarkNovelButton';
import OverlayMutedIndicator from './OverlayMutedIndicator';
import { globalStyleVariables } from '../styles';

const HIGHLIGHT_BORDER_WIDTH = 3;
const styles = StyleSheet.create({
  highlight: {
    borderWidth: HIGHLIGHT_BORDER_WIDTH,
    borderColor: globalStyleVariables.HIGHLIGHT_COLOR,
  },
  overlayTitleContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    justifyContent: 'center',
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  text: {
    color: '#fff',
    fontSize: 12,
  },
});

const NovelGridViewItem = ({
  item,
  index,
  numColumns,
  onPressItem,
  containerStyle,
  imageStyle,
  isHighlight,
  isMute,
}) => {
  const imageWidthOffset = isHighlight ? HIGHLIGHT_BORDER_WIDTH * 2 + 1 : 1;
  return (
    <PXTouchable
      style={[
        {
          marginRight: index % numColumns < numColumns - 1 ? 1 : 0,
          marginBottom: 1,
          backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
          width: globalStyleVariables.WINDOW_WIDTH / numColumns - 1,
          height: globalStyleVariables.WINDOW_WIDTH / numColumns - 1,
        },
        containerStyle,
        isHighlight && styles.highlight,
      ]}
      onPress={onPressItem}
      disabled={isMute}
    >
      {isMute ? (
        <OverlayMutedIndicator />
      ) : (
        <View>
          <PXImage
            uri={item.image_urls.square_medium}
            style={[
              {
                resizeMode: 'cover',
                width:
                  globalStyleVariables.WINDOW_WIDTH / numColumns -
                  imageWidthOffset,
                height:
                  globalStyleVariables.WINDOW_WIDTH / numColumns -
                  imageWidthOffset,
              },
              imageStyle,
            ]}
          />
          <View style={styles.overlayTitleContainer}>
            <Text style={styles.text}>{item.title}</Text>
          </View>
          <OverlayBookmarkNovelButton item={item} gridView />
        </View>
      )}
      {item.page_count > 1 ? (
        <OverlayNovelPages total={item.page_count} />
      ) : null}
    </PXTouchable>
  );
};

export default NovelGridViewItem;

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PXTouchable from './PXTouchable';
import PXImage from './PXImage';
import OverlayImagePages from './OverlayImagePages';
import OverlayUgoiraIndicator from './OverlayUgoiraIndicator';
import OverlayBookmarkButton from '../components/OverlayBookmarkButton';
import OverlayMutedIndicator from '../components/OverlayMutedIndicator';
import { globalStyleVariables } from '../styles';

const HIGHLIGHT_BORDER_WIDTH = 3;
const styles = StyleSheet.create({
  highlight: {
    borderWidth: HIGHLIGHT_BORDER_WIDTH,
    borderColor: globalStyleVariables.HIGHLIGHT_COLOR,
  },
});

class IllustItem extends Component {
  shouldComponentUpdate(nextProps) {
    const {
      item: prevItem,
      isHighlight: prevIsHighlight,
      isMute: prevIsMute,
    } = this.props;
    const { item, isHighlight, isMute } = nextProps;
    // console.log(item.id, (prevItem.is_bookmarked !== item.is_bookmarked) || (prevItem.user.is_followed !== item.user.is_followed));
    return (
      prevItem.is_bookmarked !== item.is_bookmarked ||
      prevItem.user.is_followed !== item.user.is_followed ||
      prevIsHighlight !== isHighlight ||
      prevIsMute !== isMute
    );
  }

  render() {
    const {
      item,
      index,
      numColumns,
      onPressItem,
      containerStyle,
      imageStyle,
      isHighlight,
      isMute,
    } = this.props;
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
        {isMute
          ? <OverlayMutedIndicator />
          : <View>
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
              <OverlayBookmarkButton item={item} />
            </View>}
        {item.meta_pages && item.meta_pages.length
          ? <OverlayImagePages total={item.meta_pages.length} />
          : null}
        {item.type === 'ugoira' && <OverlayUgoiraIndicator />}
      </PXTouchable>
    );
  }
}

export default connect((state, props) => {
  const { highlightTags, muteTags, muteUsers } = state;
  const { tags, user } = props.item;
  return {
    isHighlight: tags.some(t => highlightTags.items.includes(t.name)),
    isMute:
      tags.some(t => muteTags.items.includes(t.name)) ||
      muteUsers.items.some(m => m === user.id),
  };
})(IllustItem);

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  ViewPropTypes,
  ImagePropTypes,
} from 'deprecated-react-native-prop-types';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { DarkTheme } from 'react-native-paper';
import PXTouchable from './PXTouchable';
import PXImage from './PXImage';
import OverlayImagePages from './OverlayImagePages';
import OverlayUgoiraIndicator from './OverlayUgoiraIndicator';
import OverlayBookmarkIllustButton from './OverlayBookmarkIllustButton';
import OverlayMutedIndicator from './OverlayMutedIndicator';
import { makeGetIllustItem } from '../common/selectors';
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
      isShowLikeCount: prevIsShowLikeCount,
    } = this.props;
    const { item, isHighlight, isMute, isShowLikeCount } = nextProps;
    // console.log(item.id, (prevItem.is_bookmarked !== item.is_bookmarked) || (prevItem.user.is_followed !== item.user.is_followed));
    return (
      prevItem.is_bookmarked !== item.is_bookmarked ||
      prevItem.user.is_followed !== item.user.is_followed ||
      prevIsHighlight !== isHighlight ||
      prevIsMute !== isMute ||
      prevIsShowLikeCount !== isShowLikeCount
    );
  }

  render() {
    const {
      item,
      index,
      numColumns,
      onPressItem,
      parentContainerMargin,
      containerStyle,
      imageStyle,
      isHighlight,
      isMute,
      hideBookmarkButton,
      isShowLikeCount,
    } = this.props;
    const imageWidthOffset = isHighlight ? HIGHLIGHT_BORDER_WIDTH * 2 + 1 : 1;
    return (
      <PXTouchable
        style={[
          {
            marginRight: index % numColumns < numColumns - 1 ? 1 : 0,
            marginBottom: 1,
            backgroundColor: DarkTheme.colors.surface,
            width:
              (globalStyleVariables.WINDOW_WIDTH - parentContainerMargin * 2) /
                numColumns -
              1,
            height:
              (globalStyleVariables.WINDOW_WIDTH - parentContainerMargin * 2) /
                numColumns -
              1,
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
                    (globalStyleVariables.WINDOW_WIDTH -
                      parentContainerMargin * 2) /
                      numColumns -
                    imageWidthOffset,
                  height:
                    (globalStyleVariables.WINDOW_WIDTH -
                      parentContainerMargin * 2) /
                      numColumns -
                    imageWidthOffset,
                },
                imageStyle,
              ]}
            />
            {!hideBookmarkButton && (
              <OverlayBookmarkIllustButton
                item={item}
                isShowLikeCount={isShowLikeCount}
              />
            )}
          </View>
        )}
        {item.meta_pages && item.meta_pages.length ? (
          <OverlayImagePages total={item.meta_pages.length} />
        ) : null}
        {item.type === 'ugoira' && <OverlayUgoiraIndicator />}
      </PXTouchable>
    );
  }
}

IllustItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  numColumns: PropTypes.number.isRequired,
  onPressItem: PropTypes.func.isRequired,
  parentContainerMargin: PropTypes.number,
  containerStyle: ViewPropTypes.style,
  imageStyle: ImagePropTypes.style,
  isHighlight: PropTypes.bool,
  isMute: PropTypes.bool,
};
IllustItem.defaultProps = {
  parentContainerMargin: 0,
  containerStyle: {},
  imageStyle: {},
  isHighlight: false,
  isMute: false,
};

export default connect(() => {
  const getIllustItem = makeGetIllustItem();
  return (state, props) => {
    const { highlightTags, muteTags, muteUsers, likeButtonSettings } = state;
    const item = getIllustItem(state, props);
    const { tags, user } = item;
    return {
      item,
      isHighlight: tags.some((t) => highlightTags.items.includes(t.name)),
      isMute:
        tags.some((t) => muteTags.items.includes(t.name)) ||
        muteUsers.items.some((m) => m.id === user.id),
      isShowLikeCount: likeButtonSettings.isShowLikeCount,
    };
  };
})(IllustItem);

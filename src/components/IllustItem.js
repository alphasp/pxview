import React, { Component } from 'react';
import PXTouchable from './PXTouchable';
import PXImage from './PXImage';
import OverlayImagePages from './OverlayImagePages';
import OverlayBookmarkButton from '../components/OverlayBookmarkButton';
import { globalStyleVariables } from '../styles';

class IllustItem extends Component {
  shouldComponentUpdate(nextProps) {
    const { item: prevItem } = this.props;
    const { item } = nextProps;
    // console.log(item.id, (prevItem.is_bookmarked !== item.is_bookmarked) || (prevItem.user.is_followed !== item.user.is_followed));
    return (
      prevItem.is_bookmarked !== item.is_bookmarked ||
      prevItem.user.is_followed !== item.user.is_followed
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
    } = this.props;
    return (
      <PXTouchable
        style={[
          {
            marginRight: index % numColumns < numColumns - 1 ? 1 : 0,
            marginBottom: 1,
            backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
            flexGrow: 1,
          },
          containerStyle,
        ]}
        onPress={onPressItem}
      >
        <PXImage
          uri={item.image_urls.square_medium}
          style={[
            {
              height: globalStyleVariables.WINDOW_WIDTH / numColumns,
              resizeMode: 'cover',
            },
            imageStyle,
          ]}
        />
        {item.meta_pages && item.meta_pages.length
          ? <OverlayImagePages total={item.meta_pages.length} />
          : null}
        <OverlayBookmarkButton item={item} />
      </PXTouchable>
    );
  }
}

export default IllustItem;

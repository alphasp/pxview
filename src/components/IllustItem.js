import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import PXTouchable from './PXTouchable';
import PXImage from './PXImage';
import OverlayImagePages from './OverlayImagePages';
import OverlayBookmarkButtonContainer from '../containers/OverlayBookmarkButtonContainer';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

class IllustItem extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { item: prevItem } = this.props;
    const { item } = nextProps;
    // console.log(item.id, prevItem.is_bookmarked !== item.is_bookmarked, prevItem.is_followed !== item.is_followed)
    return (prevItem.is_bookmarked !== item.is_bookmarked) || (prevItem.user.is_followed !== item.user.is_followed);
  }

  render() {
    const { item, onPressItem } = this.props;
    // console.log('render ', item.id)
    return (
      <PXTouchable 
        style={{ 
          margin: 1,
          backgroundColor: '#E9EBEE',
          width: width / 3 - 2, 
          height: width / 3 - 2,
        }} 
        key={item.id} 
        onPress={onPressItem}
      >
        <PXImage 
          uri={item.image_urls.square_medium}
          style={{
            width: width / 3 - 2, 
            height: width / 3 - 2,
            resizeMode: 'cover',
          }}
        />
        {
          (item.meta_pages && item.meta_pages.length) ?
          <OverlayImagePages total={item.meta_pages.length} />
          :
          null
        }
        <OverlayBookmarkButtonContainer item={item} />
      </PXTouchable>
    );
  }
}

export default IllustItem;
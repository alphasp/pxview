import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PXTouchable from './PXTouchable';
import PXImage from './PXImage';
import OverlayImagePages from './OverlayImagePages';
import OverlayBookmarkButtonContainer from '../containers/OverlayBookmarkButtonContainer';

const windowWidth = Dimensions.get('window').width; //full width
const windowHeight = Dimensions.get('window').height; //full height
const avatarSize = 50;
const ILLUST_PREVIEW_COLUMNS = 3;
const CONTAINER_MARGIN = 10;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#E9EBEE',
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
  }
});

const IllustCollection = (props) => {
  const { navigation: { navigate }, items, title, total, viewMoreTitle, maxItems, onPressViewMore} = props;
  if (!items || !items.length) {
    return null;
  }
  const illusts = items.slice(0, maxItems || 6);
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text>{title}</Text>
        <PXTouchable onPress={onPressViewMore}>
          <View style={styles.viewAllContainer}>
            {
              total &&
              <Text style={styles.total}>{total}</Text>
            }
            <Text>{viewMoreTitle}</Text>
            <Icon name="chevron-right" style={styles.chevronIcon} />
          </View>
        </PXTouchable>
      </View>
      <View style={styles.imagePreviews}>
        {
          illusts && illusts.length &&
          illusts.map(item => {
            return (
              <PXTouchable 
                style={{ 
                  backgroundColor: "#fff",
                  borderColor: "#E9EBEE",
                  borderWidth: 1,
                  width: (windowWidth - (CONTAINER_MARGIN * 2)) / ILLUST_PREVIEW_COLUMNS, 
                  height: (windowWidth - (CONTAINER_MARGIN * 2)) / ILLUST_PREVIEW_COLUMNS,
                }} 
                key={item.id} 
                onPress={() => navigate('Detail', { item: item })}
              >
                <View>
                  <PXImage 
                    uri={item.image_urls ? item.image_urls.square_medium : ""}
                    style={[styles.cardImage, {
                      resizeMode: 'cover',
                      width: (windowWidth - (CONTAINER_MARGIN * 2)) / ILLUST_PREVIEW_COLUMNS, 
                      height: (windowWidth - (CONTAINER_MARGIN * 2)) / ILLUST_PREVIEW_COLUMNS,
                    }]}
                  />
                  {
                    (item.meta_pages && item.meta_pages.length) ?
                    <OverlayImagePages total={item.meta_pages.length} />
                    :
                    null
                  }
                  <OverlayBookmarkButtonContainer item={item} />
                </View>
              </PXTouchable>
            )
          })
        }
      </View>
    </View>
  );
}

export default IllustCollection;

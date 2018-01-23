import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PXTouchable from './PXTouchable';
import PXImage from './PXImage';
import OverlayBookmarkNovelButton from './OverlayBookmarkNovelButton';
import OverlayNovelPages from './OverlayNovelPages';
import OverlayMutedIndicator from './OverlayMutedIndicator';
import { globalStyleVariables } from '../styles';

const HIGHLIGHT_BORDER_WIDTH = 3;
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexDirection: 'row',
  },
  muteContainer: {
    height: 120,
    justifyContent: 'center',
  },
  imageContainer: {
    width: 75,
    height: 100,
  },
  highlight: {
    borderWidth: HIGHLIGHT_BORDER_WIDTH,
    borderColor: globalStyleVariables.HIGHLIGHT_COLOR,
  },
  subRightContainer: {
    margin: 10,
    flexDirection: 'column',
    flex: 1,
    flexWrap: 'wrap',
  },
  text: {
    color: '#000',
  },
  seriesTitle: {
    color: globalStyleVariables.PRIMARY_COLOR,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  user: {
    color: '#696969',
  },
  info: {},
  tagsContainer: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  tag: {
    fontSize: 12,
  },
});

class NovelListViewItem extends Component {
  renderTags = tags =>
    <View style={styles.tagsContainer}>
      {tags.map((tag, index) =>
        <Text key={tag.name} style={[styles.text, styles.tag]}>
          {tag.name}
          {index < tags.length - 1 && ' ・ '}
        </Text>,
      )}
    </View>;

  render() {
    const {
      item,
      onPressItem,
      containerStyle,
      imageStyle,
      isHighlight,
      isMute,
    } = this.props;
    return (
      <PXTouchable
        style={[
          styles.container,
          containerStyle,
          isHighlight && styles.highlight,
        ]}
        onPress={onPressItem}
        disabled={isMute}
      >
        {isMute
          ? <View style={styles.muteContainer}>
              <OverlayMutedIndicator />
            </View>
          : <View style={styles.contentContainer}>
              <View style={styles.imageContainer}>
                <PXImage
                  uri={item.image_urls.square_medium}
                  style={[
                    {
                      resizeMode: 'cover',
                      flex: 1,
                    },
                    imageStyle,
                  ]}
                />
                {
                  <OverlayBookmarkNovelButton
                    item={item}
                    total={item.total_bookmarks}
                  />
                }
                {item.page_count > 1
                  ? <OverlayNovelPages total={item.page_count} />
                  : null}
              </View>
              <View style={styles.subRightContainer}>
                {item.series &&
                  item.series.id &&
                  <Text style={[styles.text, styles.seriesTitle]}>
                    {item.series.title}
                  </Text>}
                <Text style={[styles.text, styles.title]} ellipsisMode="tail">
                  {item.title}
                </Text>
                <Text style={[styles.text, styles.user]}>
                  by {item.user.name}
                </Text>
                <Text style={[styles.text, styles.info]}>
                  {item.text_length}words
                </Text>
                {this.renderTags(item.tags)}
              </View>
            </View>}
      </PXTouchable>
    );
  }
}

export default NovelListViewItem;

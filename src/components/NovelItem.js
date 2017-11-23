import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PXTouchable from './PXTouchable';
import PXImage from './PXImage';
import OverlayBookmarkNovelButton from './OverlayBookmarkNovelButton';
import OverlayNovelPages from './OverlayNovelPages';
// import OverlayMutedIndicator from '../components/OverlayMutedIndicator';
import { globalStyleVariables } from '../styles';

const HIGHLIGHT_BORDER_WIDTH = 3;
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
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

class NovelItem extends Component {
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
        <View style={{ width: 100 }}>
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
})(NovelItem);

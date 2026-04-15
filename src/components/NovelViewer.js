import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import HtmlView from 'react-native-htmlview';
import entities from 'entities';
import { Text } from 'react-native-paper';
import PXTabView from './PXTabView';
import NovelInlineImage from './NovelInlineImage';
import { MODAL_TYPES } from '../common/constants';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: globalStyleVariables.WINDOW_WIDTH,
    padding: 10,
  },
  novelChapter: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pageLink: {
    fontWeight: '500',
    color: '#007AFF',
  },
});

const MAX_HTML_CHUNK_LENGTH = 3000;
const PROTECTED_TAGS = new Set(['a', 'chapter', 'jump', 'px-image']);
const SPLITTABLE_PROTECTED_TAGS = new Set(['a', 'chapter', 'jump']);

const getTagInfo = (token) => {
  const match = token.match(/^<\/?([a-zA-Z0-9-]+)/);
  if (!match) {
    return null;
  }

  return {
    name: match[1],
    isClosing: token[1] === '/',
  };
};

const tokenizeHtml = (html) => html.match(/<[^>]+>|[^<]+/g) || [];
const decodeHtmlText = (text = '') => entities.decodeHTML(text);

const collectProtectedRegion = (tokens, startIndex) => {
  const openingTag = tokens[startIndex];
  const openingTagInfo = getTagInfo(openingTag);
  if (!openingTagInfo || openingTagInfo.isClosing) {
    return null;
  }

  const innerTokens = [];
  let depth = 1;

  for (let index = startIndex + 1; index < tokens.length; index += 1) {
    const token = tokens[index];
    const tagInfo = getTagInfo(token);

    if (tagInfo && tagInfo.name === openingTagInfo.name) {
      depth += tagInfo.isClosing ? -1 : 1;
      if (!depth) {
        return {
          closeTag: token,
          innerHtml: innerTokens.join(''),
          nextIndex: index,
          openTag: openingTag,
          tagName: openingTagInfo.name,
          text: `${openingTag}${innerTokens.join('')}${token}`,
        };
      }
    }

    innerTokens.push(token);
  }

  return {
    closeTag: '',
    innerHtml: innerTokens.join(''),
    nextIndex: tokens.length - 1,
    openTag: openingTag,
    tagName: openingTagInfo.name,
    text: `${openingTag}${innerTokens.join('')}`,
  };
};

const normalizeProtectedRegions = (html, maxLength) => {
  const tokens = tokenizeHtml(html);
  let output = '';

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const tagInfo = getTagInfo(token);

    if (tagInfo && !tagInfo.isClosing && PROTECTED_TAGS.has(tagInfo.name)) {
      const region = collectProtectedRegion(tokens, index);
      if (!region) {
        output += token;
        continue;
      }

      if (
        region.text.length > maxLength &&
        SPLITTABLE_PROTECTED_TAGS.has(region.tagName)
      ) {
        const wrapperLength = region.openTag.length + region.closeTag.length;
        const innerMaxLength = maxLength - wrapperLength;

        if (innerMaxLength > 0) {
          const innerChunks = chunkHtmlPreservingTags(
            region.innerHtml,
            innerMaxLength,
          );
          output += innerChunks
            .map((chunk) => `${region.openTag}${chunk}${region.closeTag}`)
            .join('');
        } else {
          output += region.text;
        }
      } else {
        output += region.text;
      }

      index = region.nextIndex;
      continue;
    }

    output += token;
  }

  return output;
};

export const chunkHtmlPreservingTags = (
  html,
  maxLength = MAX_HTML_CHUNK_LENGTH,
) => {
  if (!html) {
    return [];
  }

  const normalizedHtml = normalizeProtectedRegions(html, maxLength);
  const tokens = tokenizeHtml(normalizedHtml);
  const chunks = [];
  let current = '';
  let protectedDepth = 0;

  const flushCurrent = () => {
    if (current) {
      chunks.push(current);
      current = '';
    }
  };

  tokens.forEach((token, tokenIndex) => {
    const tagInfo = getTagInfo(token);
    if (tagInfo) {
      const isProtectedTag = PROTECTED_TAGS.has(tagInfo.name);
      if (!tagInfo.isClosing && isProtectedTag) {
        const protectedRegion = !protectedDepth
          ? collectProtectedRegion(tokens, tokenIndex)
          : null;
        const protectedRegionLength = protectedRegion
          ? protectedRegion.text.length
          : token.length;

        if (
          !protectedDepth &&
          current.length &&
          current.length + protectedRegionLength > maxLength
        ) {
          flushCurrent();
        }
        current += token;
        protectedDepth += 1;
        return;
      }

      current += token;
      if (tagInfo.isClosing && isProtectedTag && protectedDepth > 0) {
        protectedDepth -= 1;
      }

      if (!protectedDepth && current.length >= maxLength) {
        flushCurrent();
      }
      return;
    }

    if (protectedDepth) {
      current += token;
      return;
    }

    let remaining = token;
    while (remaining.length) {
      if (current.length === maxLength) {
        flushCurrent();
      }

      const spaceLeft = maxLength - current.length;
      const nextLength = Math.min(spaceLeft, remaining.length);
      current += remaining.slice(0, nextLength);
      remaining = remaining.slice(nextLength);

      if (current.length === maxLength) {
        flushCurrent();
      }
    }
  });

  flushCurrent();
  return chunks;
};

// --- Modal slider constants ---
const MODAL_TRACK_WIDTH = 4;
const MODAL_THUMB_W = 28;
const MODAL_THUMB_H = 60;
const MODAL_SLIDER_WIDTH = 100;
const MODAL_SLIDER_RIGHT_PAD = 20;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class NovelPage extends Component {
  constructor(props) {
    super(props);
    this.scrollRef = React.createRef();
    this.modalDragStartY = 0;
    this.modalDragStartScrollY = 0;
    this.isModalDragging = false;
    this.state = {
      scrollY: 0,
      contentHeight: 0,
      containerHeight: 0,
      modalOpen: false,
      modalDragging: false,
    };
  }

  getScrollable() {
    const { contentHeight, containerHeight } = this.state;
    return Math.max(0, contentHeight - containerHeight);
  }

  getRatio() {
    const { scrollY } = this.state;
    const scrollable = this.getScrollable();
    if (!scrollable) return 0;
    return Math.max(0, Math.min(1, scrollY / scrollable));
  }

  handleScroll = (e) => {
    this.setState({ scrollY: e.nativeEvent.contentOffset.y });
  };

  // --- Modal navigation ---
  openModal = () => {
    this.setState({ modalOpen: true });
  };

  closeModal = () => {
    this.isModalDragging = false;
    this.setState({ modalOpen: false, modalDragging: false });
  };

  getModalTrackHeight() {
    return SCREEN_HEIGHT - 200;
  }

  getModalThumbTop() {
    const ratio = this.getRatio();
    const trackH = this.getModalTrackHeight();
    return ratio * (trackH - MODAL_THUMB_H);
  }

  handleModalGrant = (e) => {
    this.isModalDragging = true;
    this.setState({ modalDragging: true });
    // Stop momentum
    const { scrollY } = this.state;
    if (this.scrollRef.current) {
      this.scrollRef.current.scrollTo({ y: scrollY, animated: false });
    }
    this.modalDragStartScrollY = scrollY;
    this.modalDragStartY = e.nativeEvent.pageY;
  };

  handleModalMove = (e) => {
    if (!this.isModalDragging) return;
    const scrollable = this.getScrollable();
    if (!scrollable) return;
    const trackH = this.getModalTrackHeight();
    const maxTop = trackH - MODAL_THUMB_H;
    if (!maxTop) return;
    const dy = e.nativeEvent.pageY - this.modalDragStartY;
    const scrollDelta = (dy / maxTop) * scrollable;
    const nextY = Math.max(
      0,
      Math.min(this.modalDragStartScrollY + scrollDelta, scrollable),
    );
    if (this.scrollRef.current) {
      this.scrollRef.current.scrollTo({ y: nextY, animated: false });
    }
    this.setState({ scrollY: nextY });
  };

  handleModalRelease = () => {
    this.isModalDragging = false;
    this.setState({ modalDragging: false });
  };

  getSliderSide() {
    const { sliderSide } = this.props;
    return sliderSide === 'left' ? 'left' : 'right';
  }

  getPercentageSide() {
    const { sliderPercentageSide, sliderSide } = this.props;
    if (sliderPercentageSide === 'left' || sliderPercentageSide === 'right') {
      return sliderPercentageSide;
    }
    return sliderSide === 'left' ? 'left' : 'right';
  }

  renderPercentPill() {
    const scrollable = this.getScrollable();
    if (scrollable <= 10) return null;
    const pct = (this.getRatio() * 100).toFixed(1);
    const side = this.getPercentageSide();
    const pos = side === 'left' ? { left: 14 } : { right: 14 };
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={this.openModal}
        style={{
          position: 'absolute',
          bottom: 16,
          ...pos,
          backgroundColor: 'rgba(30,30,30,0.45)',
          paddingVertical: 5,
          paddingHorizontal: 12,
          borderRadius: 14,
          zIndex: 80,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 11 }}>{pct}%</Text>
      </TouchableOpacity>
    );
  }

  renderModalNav() {
    const { modalOpen, modalDragging } = this.state;
    if (!modalOpen) return null;
    const trackH = this.getModalTrackHeight();
    const modalThumbTop = this.getModalThumbTop();
    const side = this.getSliderSide();
    const isLeft = side === 'left';

    const sliderArea = (
      <View
        style={{
          width: MODAL_SLIDER_WIDTH,
          backgroundColor: 'rgba(0,0,0,0.5)',
          paddingRight: isLeft ? 0 : MODAL_SLIDER_RIGHT_PAD,
          paddingLeft: isLeft ? MODAL_SLIDER_RIGHT_PAD : 0,
          paddingTop: 100,
          paddingBottom: 100,
          alignItems: 'center',
        }}
        onStartShouldSetResponder={() => true}
        onResponderGrant={this.handleModalGrant}
        onResponderMove={this.handleModalMove}
        onResponderRelease={this.handleModalRelease}
      >
        <View
          style={{
            width: MODAL_TRACK_WIDTH,
            height: trackH,
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 2,
          }}
        >
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: -(MODAL_THUMB_W - MODAL_TRACK_WIDTH) / 2,
              top: modalThumbTop,
              width: MODAL_THUMB_W,
              height: MODAL_THUMB_H,
              backgroundColor: modalDragging ? '#e0f0ff' : '#ffffff',
              borderRadius: 14,
              elevation: 6,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
            }}
          />
        </View>
      </View>
    );

    const closeArea = (
      <TouchableOpacity
        activeOpacity={1}
        onPress={this.closeModal}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
          点击退出导航
        </Text>
      </TouchableOpacity>
    );

    return (
      <Modal
        transparent
        visible
        animationType="fade"
        onRequestClose={this.closeModal}
      >
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {isLeft ? sliderArea : closeArea}
          {isLeft ? closeArea : sliderArea}
        </View>
      </Modal>
    );
  }

  render() {
    const { children } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={this.scrollRef}
          scrollEventThrottle={16}
          onScroll={this.handleScroll}
          onContentSizeChange={(w, h) => this.setState({ contentHeight: h })}
          onLayout={(e) =>
            this.setState({ containerHeight: e.nativeEvent.layout.height })
          }
        >
          {children}
        </ScrollView>

        {this.renderPercentPill()}
        {this.renderModalNav()}
      </View>
    );
  }
}

class NovelViewer extends Component {
  constructor(props) {
    super(props);
    const { items, index } = props;
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      index,
      routes: items.map((item, i) => ({
        key: i.toString(),
      })),
    };
  }

  componentDidUpdate(prevProps) {
    const { index } = this.props;
    const { index: prevIndex } = prevProps;
    if (index !== prevIndex) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        // eslint-disable-next-line react/no-unused-state
        index,
      });
    }
  }

  getHtmlTextComponentProps = (textProps = {}) => {
    const { fontSize, lineHeight } = this.props;
    const { style, ...restTextProps } = textProps;

    return {
      selectable: true,
      ...restTextProps,
      style: [
        {
          fontSize,
          lineHeight: fontSize * lineHeight,
        },
        style,
      ].filter(Boolean),
    };
  };

  renderInlineSafeTextContainer = (
    node,
    index,
    parent,
    defaultRenderer,
    textProps = {},
  ) => {
    const mergedTextProps = this.getHtmlTextComponentProps(textProps);
    const { style: textStyle, ...restTextProps } = mergedTextProps;

    if (node.children.length === 1 && node.children[0].type === 'text') {
      return (
        <Text key={index} style={textStyle} {...restTextProps}>
          {decodeHtmlText(node.children[0].data)}
        </Text>
      );
    }

    const renderedChildren = node.children.reduce(
      (children, child, childIndex) => {
        const childKey = `${index}-${childIndex}`;

        if (child.type === 'text') {
          children.push(decodeHtmlText(child.data));
          return children;
        }

        const renderedChild =
          this.handleRenderNode(
            child,
            childKey,
            node.children,
            node,
            defaultRenderer,
          ) || defaultRenderer([child], node);

        React.Children.toArray(renderedChild).forEach(
          (renderedEntry, renderedEntryIndex) => {
            const renderedKey = `${childKey}-${renderedEntryIndex}`;

            if (
              typeof renderedEntry === 'string' ||
              typeof renderedEntry === 'number'
            ) {
              children.push(renderedEntry);
              return;
            }

            if (!React.isValidElement(renderedEntry)) {
              return;
            }

            children.push(
              React.cloneElement(renderedEntry, {
                key: renderedEntry.key || renderedKey,
              }),
            );
          },
        );

        return children;
      },
      [],
    );

    return (
      <Text key={index} style={textStyle} {...restTextProps}>
        {renderedChildren}
      </Text>
    );
  };

  renderChapterNode = (node, index, parent, defaultRenderer) =>
    this.renderInlineSafeTextContainer(node, index, parent, defaultRenderer, {
      style: styles.novelChapter,
    });

  renderAnchorNode = (node, index, parent, defaultRenderer) => {
    const { href } = node.attribs || {};

    return this.renderInlineSafeTextContainer(
      node,
      index,
      parent,
      defaultRenderer,
      {
        onPress: href ? () => Linking.openURL(decodeHtmlText(href)) : undefined,
        style: styles.pageLink,
      },
    );
  };

  handleRenderNode = (node, index, siblings, parent, defaultRenderer) => {
    const { debugInfo, embeddedImages, onPressPageLink } = this.props;
    if (node.name === 'chapter') {
      return this.renderChapterNode(node, index, parent, defaultRenderer);
    }
    if (node.name === 'jump') {
      const { page } = node.attribs;
      return this.renderInlineSafeTextContainer(
        node,
        index,
        parent,
        defaultRenderer,
        {
          onPress: () => onPressPageLink(page),
          style: styles.pageLink,
        },
      );
    }
    if (node.name === 'a') {
      return this.renderAnchorNode(node, index, parent, defaultRenderer);
    }
    if (node.name === 'px-image') {
      const imageId = node.attribs && node.attribs['data-illust-id'];
      const imageKind = node.attribs && node.attribs['data-image-kind'];
      const parsedPageNumber = parseInt(
        node.attribs && node.attribs['data-page-number'],
        10,
      );
      return (
        <NovelInlineImage
          key={index}
          debugInfo={debugInfo}
          imageId={imageId}
          imageKind={imageKind}
          pageNumber={Number.isNaN(parsedPageNumber) ? null : parsedPageNumber}
          embeddedImages={embeddedImages}
          maxWidth={globalStyleVariables.WINDOW_WIDTH - 20}
        />
      );
    }
    // other nodes render by default renderer
    return undefined;
  };

  handleOnPressOpenSettings = () => {
    const { openModal } = this.props;
    openModal(MODAL_TYPES.NOVEL_SETTINGS);
  };

  renderHtmlViewTextComponent = (props) => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Text {...props} />;
  };

  renderScene = ({ route }) => {
    const { routes } = this.state;
    const { novelId, fontSize, lineHeight, items, index } = this.props;
    const sceneIndex = routes.indexOf(route);
    const item = items[sceneIndex];
    const pagedItem = chunkHtmlPreservingTags(item);
    // render text by chunks to prevent over text limit while preserving HTML tags
    return (
      <NovelPage
        sliderSide={this.props.sliderSide}
        sliderPercentageSide={this.props.sliderPercentageSide}
      >
        <View style={styles.container}>
          {pagedItem.map((t, i) => (
            <HtmlView
              key={`${novelId}-${index}-${i}`} // eslint-disable-line react/no-array-index-key
              value={t}
              renderNode={this.handleRenderNode}
              textComponentProps={this.getHtmlTextComponentProps()}
              TextComponent={this.renderHtmlViewTextComponent}
            />
          ))}
        </View>
      </NovelPage>
    );
  };

  renderTabBar = () => null;

  render() {
    const { onIndexChange } = this.props;
    return (
      <PXTabView
        navigationState={this.state}
        renderTabBar={this.renderTabBar}
        renderScene={this.renderScene}
        onIndexChange={onIndexChange}
        lazyPreloadDistance={2}
      />
    );
  }
}

export default NovelViewer;

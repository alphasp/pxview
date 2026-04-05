import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
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

      if (
        !protectedDepth &&
        current.length >= maxLength
      ) {
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

    const renderedChildren = node.children.reduce((children, child, childIndex) => {
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
    }, []);

    return (
      <Text key={index} style={textStyle} {...restTextProps}>
        {renderedChildren}
      </Text>
    );
  };

  renderChapterNode = (node, index, parent, defaultRenderer) =>
    this.renderInlineSafeTextContainer(
      node,
      index,
      parent,
      defaultRenderer,
      { style: styles.novelChapter },
    );

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
    const { onPressPageLink } = this.props;
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
      const illustId = node.attribs && node.attribs['data-illust-id'];
      return (
        <NovelInlineImage
          key={index}
          illustId={illustId}
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
      <View style={styles.container}>
        <ScrollView>
          {pagedItem.map((t, i) => (
            <HtmlView
              key={`${novelId}-${index}-${i}`} // eslint-disable-line react/no-array-index-key
              value={t}
              renderNode={this.handleRenderNode}
              textComponentProps={this.getHtmlTextComponentProps()}
              TextComponent={this.renderHtmlViewTextComponent}
            />
          ))}
        </ScrollView>
      </View>
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

import React, { Component } from 'react';
import { View, Platform, StyleSheet, ScrollView } from 'react-native';
import {
  TabViewAnimated,
  TabViewPagerScroll,
  TabViewPagerPan,
} from 'react-native-tab-view';
import HtmlView from 'react-native-htmlview';
import { Text } from 'react-native-paper';
import { MODAL_TYPES } from '../common/constants';
import { globalStyles, globalStyleVariables } from '../styles';

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

class NovelViewer extends Component {
  constructor(props) {
    super(props);
    const { items, index, fontSize, lineHeight } = props;
    this.state = {
      index,
      routes: items.map((item, i) => ({
        key: i.toString(),
      })),
      fontSize,
      lineHeight,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { index, fontSize, lineHeight } = nextProps;
    const {
      index: prevIndex,
      fontSize: prevFontSize,
      lineHeight: prevLineHeight,
    } = this.props;
    if (
      index !== prevIndex ||
      fontSize !== prevFontSize ||
      lineHeight !== prevLineHeight
    ) {
      this.setState({
        index,
        fontSize,
        lineHeight,
      });
    }
  }

  handleRenderNode = (node, index, siblings, parent, defaultRenderer) => {
    const { onPressPageLink } = this.props;
    if (node.name === 'chapter') {
      return (
        <Text key={index} style={styles.novelChapter}>
          {defaultRenderer(node.children, parent)}
        </Text>
      );
    } else if (node.name === 'jump') {
      const { page } = node.attribs;
      return (
        <Text
          key={index}
          style={styles.pageLink}
          onPress={() => onPressPageLink(page)}
        >
          {defaultRenderer(node.children, parent)}
        </Text>
      );
    }
    // other nodes render by default renderer
    return undefined;
  };

  handleOnPressOpenSettings = () => {
    const { openModal } = this.props;
    openModal(MODAL_TYPES.NOVEL_SETTINGS);
  };

  renderPager = props =>
    Platform.OS === 'ios'
      ? <TabViewPagerScroll {...props} />
      : <TabViewPagerPan {...props} />;

  renderScene = ({ route, index }) => {
    if (Math.abs(this.state.index - this.state.routes.indexOf(route)) > 3) {
      return null;
    }
    const { novelId, fontSize, lineHeight, items } = this.props;
    const item = items[index];
    // render text by chunks to prevent over text limit https://github.com/facebook/react-native/issues/15663
    return (
      <View style={styles.container}>
        <ScrollView>
          {item.match(/(.|[\r\n]){1,3000}/g).map((t, i) =>
            <HtmlView
              key={`${novelId}-${index}-${i}`} // eslint-disable-line react/no-array-index-key
              value={t}
              renderNode={this.handleRenderNode}
              textComponentProps={{
                style: {
                  fontSize,
                  lineHeight: fontSize * lineHeight,
                },
                selectable: true,
              }}
              TextComponent={Text}
            />,
          )}
        </ScrollView>
      </View>
    );
  };

  render() {
    const { onIndexChange } = this.props;
    return (
      <TabViewAnimated
        style={globalStyles.container}
        navigationState={this.state}
        renderScene={this.renderScene}
        renderPager={this.renderPager}
        onIndexChange={onIndexChange}
      />
    );
  }
}

export default NovelViewer;

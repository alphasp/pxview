import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import HtmlView from 'react-native-htmlview';
import { Text } from 'react-native-paper';
import PXTabView from './PXTabView';
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

  handleRenderNode = (node, index, siblings, parent, defaultRenderer) => {
    const { onPressPageLink } = this.props;
    if (node.name === 'chapter') {
      return (
        <Text key={index} style={styles.novelChapter}>
          {node.children.length === 1 && node.children[0].type === 'text'
            ? node.children[0].data
            : defaultRenderer(node.children, parent)}
        </Text>
      );
    }
    if (node.name === 'jump') {
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

  renderHtmlViewTextComponent = (props) => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Text {...props} />;
  };

  renderScene = ({ route }) => {
    const { routes } = this.state;
    const { novelId, fontSize, lineHeight, items, index } = this.props;
    const sceneIndex = routes.indexOf(route);
    const item = items[sceneIndex];
    const pagedItem = item.match(/(.|[\r\n]){1,3000}/g) || [];
    // render text by chunks to prevent over text limit https://github.com/facebook/react-native/issues/15663
    return (
      <View style={styles.container}>
        <ScrollView>
          {pagedItem.map((t, i) => (
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

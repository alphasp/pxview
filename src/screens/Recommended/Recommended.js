import React, { Component } from 'react';
import { Contentsquare } from '@contentsquare/react-native-sdk';
import PXTabView from '../../components/PXTabView';
import RecommendedIllusts from './RecommendedIllusts';
import RecommendedMangas from './RecommendedMangas';
import RecommendedNovels from './RecommendedNovels';
import { connectLocalization } from '../../components/Localization';
import config from '../../common/config';

const tags = [
  'Recommended - Illust',
  'Recommended - Manga',
  'Recommended - Novel',
];

class Recommended extends Component {
  constructor(props) {
    super(props);
    const { i18n } = props;
    this.state = {
      index: 0,
      routes: [
        { key: '1', title: i18n.illust },
        { key: '2', title: i18n.manga },
        { key: '3', title: i18n.novel },
      ],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { lang: prevLang } = this.props;
    const { lang, i18n } = nextProps;
    if (lang !== prevLang) {
      this.setState({
        routes: [
          { key: '1', title: i18n.illustration },
          { key: '2', title: i18n.manga },
          { key: '3', title: i18n.novel },
        ],
      });
    }
  }

  handleChangeTab = index => {
    this.setState({ index });
  };

  renderScene = ({ route }) => {
    const { navigation } = this.props;
    switch (route.key) {
      case '1':
        return <RecommendedIllusts navigation={navigation} />;
      case '2':
        return <RecommendedMangas navigation={navigation} />;
      case '3':
        return <RecommendedNovels navigation={navigation} />;
      default:
        return null;
    }
  };

  render() {
    const { index } = this.state;
    Contentsquare.send(tags[index]);
    return (
      <PXTabView
        navigationState={this.state}
        renderScene={this.renderScene}
        onIndexChange={this.handleChangeTab}
        includeStatusBarPadding={config.navigation.tab}
      />
    );
  }
}

export default connectLocalization(Recommended);

import React, { Component } from 'react';
import PXTabView from '../../components/PXTabView';
import RecommendedIllusts from './RecommendedIllusts';
import RecommendedMangas from './RecommendedMangas';
import RecommendedNovels from './RecommendedNovels';
import { connectLocalization } from '../../components/Localization';
import config from '../../common/config';

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

  handleChangeTab = (index) => {
    this.setState({ index });
  };

  renderScene = ({ route }) => {
    switch (route.key) {
      case '1':
        return <RecommendedIllusts />;
      case '2':
        return <RecommendedMangas />;
      case '3':
        return <RecommendedNovels />;
      default:
        return null;
    }
  };

  render() {
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

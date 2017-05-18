import React, { Component } from 'react';
import PXTabView from '../../components/PXTabView';
import RecommendedIllusts from './RecommendedIllusts';
import RecommendedMangas from './RecommendedMangas';
import { connectLocalization } from '../../components/Localization';

class Home extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      tabBarLabel: params && params.i18n.home,
    };
  };

  constructor(props) {
    super(props);
    const { i18n } = props;
    this.state = {
      index: 0,
      routes: [
        { key: '1', title: i18n.illustration },
        { key: '2', title: i18n.manga },
      ],
    };
  }

  componentDidMount() {
    const { i18n, navigation: { setParams } } = this.props;
    setParams({
      i18n,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { lang: prevLang } = this.props;
    const { lang, i18n } = nextProps;
    if (lang !== prevLang) {
      this.setState({
        routes: [
          { key: '1', title: i18n.illustration },
          { key: '2', title: i18n.manga },
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
      default:
        return null;
    }
  };

  render() {
    return (
      <PXTabView
        navigationState={this.state}
        renderScene={this.renderScene}
        onRequestChangeTab={this.handleChangeTab}
        includeStatusBarPadding
      />
    );
  }
}

export default connectLocalization(Home);

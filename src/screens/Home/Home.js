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
    this.state = {
      index: 0,
      routes: [
        { key: '1', title: 'Illustration' },
        { key: '2', title: 'Manga' },
      ],
    };
  }

  componentDidMount() {
    const { i18n, navigation: { setParams } } = this.props;
    setParams({
      i18n,
    });
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

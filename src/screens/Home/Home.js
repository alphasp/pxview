import React, { Component } from 'react';
import PXTabView from '../../components/PXTabView';
import RecommendedIllusts from './RecommendedIllusts';
import RecommendedMangas from './RecommendedMangas';

class Home extends Component {
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

  handleChangeTab = index => {
    this.setState({ index });
  };

  renderScene = ({ route }) => {
    const { navigation, screenProps } = this.props;
    switch (route.key) {
      case '1':
        return (
          <RecommendedIllusts
            navigation={navigation}
            screenProps={screenProps}
          />
        );
      case '2':
        return (
          <RecommendedMangas
            navigation={navigation}
            screenProps={screenProps}
          />
        );
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

export default Home;

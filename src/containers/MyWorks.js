import React, { Component } from 'react';
import PXTabView from '../components/PXTabView';
import UserIllusts from './UserIllusts';
import UserMangas from './UserMangas';

class MyWorks extends Component {
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
    const { userId } = this.props.navigation.state.params;
    switch (route.key) {
      case '1':
        return <UserIllusts userId={userId} />;
      case '2':
        return <UserMangas userId={userId} />;
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
      />
    );
  }
}

export default MyWorks;

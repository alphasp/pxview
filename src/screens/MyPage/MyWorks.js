import React, { Component } from 'react';
import UserIllusts from '../Shared/UserIllusts';
import UserMangas from '../Shared/UserMangas';
import { connectLocalization } from '../../components/Localization';
import PXTabView from '../../components/PXTabView';

class MyWorks extends Component {
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
    const { userId } = navigation.state.params;
    switch (route.key) {
      case '1':
        return <UserIllusts userId={userId} navigation={navigation} />;
      case '2':
        return <UserMangas userId={userId} navigation={navigation} />;
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

export default connectLocalization(MyWorks);

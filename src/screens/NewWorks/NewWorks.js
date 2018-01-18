import React, { Component } from 'react';
import FollowingUserNewWorks from './FollowingUserNewWorks';
import UserNewWorks from './UserNewWorks';
import MyPixivNewWorks from './MyPixivNewWorks';
import { connectLocalization } from '../../components/Localization';
import PXTabView from '../../components/PXTabView';

class NewWorks extends Component {
  constructor(props) {
    super(props);
    const { i18n } = props;
    this.state = {
      index: 0,
      routes: [
        { key: '1', title: i18n.following },
        { key: '2', title: i18n.newest },
        { key: '3', title: i18n.myPixiv },
      ],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { lang: prevLang } = this.props;
    const { lang, i18n } = nextProps;
    if (lang !== prevLang) {
      this.setState({
        routes: [
          { key: '1', title: i18n.follow },
          { key: '2', title: i18n.illustration },
          { key: '3', title: i18n.myPixiv },
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
        return <FollowingUserNewWorks navigation={navigation} />;
      case '2':
        return <UserNewWorks navigation={navigation} />;
      case '3':
        return <MyPixivNewWorks navigation={navigation} />;
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
        includeStatusBarPadding
      />
    );
  }
}

export default connectLocalization(NewWorks);

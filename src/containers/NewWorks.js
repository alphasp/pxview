import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { TabBar } from 'react-native-tab-view';
import FollowingUserIllusts from './FollowingUserIllusts';
import NewIllusts from './NewIllusts';
import NewMangas from './NewMangas';
import MyPixiv from './MyPixiv';
import Login from './Login';
import PXTabView from '../components/PXTabView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
    ...Platform.select({
      ios: {
        marginTop: 15
      },
    }),
  },
});

class PageWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = { loaded : props.active }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active && !this.state.loaded) {
      this.setState({loaded: true})
    }
  }

  render() {
    const { active, children } = this.props;
    return active || this.state.loaded ? <View style={{flex: 1}}>{children}</View> : null;
  }
}

class NewWorks extends Component {
  constructor(props) {
    super(props);
    const { user } = props;
    let routes = [
      { key: '1', title: 'Following' },
      { key: '2', title: 'Illust' },
      { key: '3', title: 'Manga' }
    ];
    if (user) {
      routes = [...routes, { key: '4', title: 'My Pixiv' }];
    }

    this.state = {
      index: 0,
      routes
    }
  }

  componentWillReceiveProps(nextProps) {
    const { user: prevUser } = this.props;
    const { user } = nextProps;
    if ((!user && prevUser) || (user && !prevUser)) {
      const { routes, index } = this.state;
      if (!user) {
        if (index === 3) {
          this.setState({
            ...this.state,
            routes: routes.filter(route => route.key !== 4),
            index: 0
          });
        }
        else {
          this.setState({
            ...this.state,
            routes: routes.filter(route => route.key !== 4)
          });
        }
      }
      else {
        if (!routes.some(route => route.key === 4)) {
          this.setState({
            ...this.state,
            routes: [...routes, { key: '4', title: 'My Pixiv'}]
          });
        }
      }
    }
  }

  handleChangeTab = (index) => {
    this.setState({ index });
  };

  renderHeader = (props) => {
    return (
      <TabBar
        {...props}
        scrollEnabled
      />
    );
  };

  renderScene = ({ route, index }) => {
    const { navigation, screenProps } = this.props;
    console.log('index ', index)
    switch (route.key) {
      case '1':
        return (
          <PageWrapper active={index == this.state.index}>
            <FollowingUserIllusts screenProps={screenProps} navigation={navigation} />
          </PageWrapper>
        );
      case '2': 
        return (
          <PageWrapper active={index == this.state.index}>
            <NewIllusts screenProps={screenProps} />
          </PageWrapper>
        ) ;
      case '3': 
        return (
          <PageWrapper active={index == this.state.index}>
            <NewMangas screenProps={screenProps} />
          </PageWrapper>
        );
      case '4': 
        return (
          <PageWrapper active={index == this.state.index}>
            <MyPixiv screenProps={screenProps} />
          </PageWrapper>
        );
      default:
        return null;
    };
  }

  render() {
    const { user, navigation, screenProps } = this.props;
    return (
      <PXTabView
        navigationState={this.state}
        renderScene={this.renderScene}
        renderHeader={this.renderHeader}
        onRequestChangeTab={this.handleChangeTab}
      />
    );
  }
}

export default connect(state => {
  return {
    user: state.auth.user
  }
})(NewWorks);
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import IllustList from '../components/IllustList';
import { Button } from 'react-native-elements';
import * as followingUserActionCreators from '../common/actions/followingUserIllust';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  usersIcon: {
    marginBottom: 10
  },
  recommendUserButton: {
    marginTop: 10,
    backgroundColor: '#5cafec',
  },
});

class FollowingUserIllust extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { user, fetchFollowingUserIllusts, clearFollowingUserIllusts } = this.props;
    if (user) {
      clearFollowingUserIllusts();
      fetchFollowingUserIllusts();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { user: prevUser } = this.props;
    const { user, fetchFollowingUserIllusts, clearFollowingUserIllusts } = nextProps;
    if (user && user !== prevUser) {
      clearFollowingUserIllusts();
      fetchFollowingUserIllusts();
    }
  }

  loadMoreItems = () => {
    const { user, fetchFollowingUserIllusts, followingUserIllust: { nextUrl } } = this.props;
    console.log('load more ', nextUrl)
    if (nextUrl) {
      fetchFollowingUserIllusts("", nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { fetchFollowingUserIllusts, clearFollowingUserIllusts } = this.props;
    this.setState({
      refereshing: true
    });
    clearFollowingUserIllusts();
    fetchFollowingUserIllusts().finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  handleOnPressFindRecommendedUsers = () => {
    const { navigate } = this.props.navigation;
    navigate('RecommendedUser', {
      navigation: this.props.navigation
    });
  }

  render() {
    const { followingUserIllust, user, screenProps: { strings } } = this.props;
    const { refreshing } = this.state;
    if (!user) {
      return (
        <View style={styles.container}>
          <Icon name="users" size={40} style={styles.usersIcon} />
          <Text>{strings.followUserNullState}</Text>
          <Text>{strings.newWorkFollowNullState}</Text>
          <Button 
            title={strings.findRecommendedUsers}
            buttonStyle={styles.recommendUserButton}
            onPress={this.handleOnPressFindRecommendedUsers}
            raised
          />
        </View>
      )
    }
    return (
      <IllustList
        data={followingUserIllust}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(state => {
  return {
    followingUserIllust: state.followingUserIllust,
  }
}, followingUserActionCreators)(FollowingUserIllust);
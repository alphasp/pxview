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
import * as followingUserIllustsActionCreators
  from '../common/actions/followingUserIllusts';
import { getFollowingUserIllustsItems } from '../common/selectors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  usersIcon: {
    marginBottom: 10,
  },
  recommendUserButton: {
    marginTop: 10,
    backgroundColor: '#5cafec',
  },
});

class FollowingUserIllusts extends Component {
  componentDidMount() {
    const {
      user,
      fetchFollowingUserIllusts,
      clearFollowingUserIllusts,
    } = this.props;
    if (user) {
      clearFollowingUserIllusts();
      fetchFollowingUserIllusts();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { user: prevUser } = this.props;
    const {
      user,
      fetchFollowingUserIllusts,
      clearFollowingUserIllusts,
    } = nextProps;
    if (user && user !== prevUser) {
      clearFollowingUserIllusts();
      fetchFollowingUserIllusts();
    }
  }

  loadMoreItems = () => {
    const {
      user,
      fetchFollowingUserIllusts,
      followingUserIllusts: { loading, nextUrl },
    } = this.props;
    if (!loading && nextUrl) {
      console.log('load more ', nextUrl);
      fetchFollowingUserIllusts(nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { fetchFollowingUserIllusts, clearFollowingUserIllusts } = this.props;
    clearFollowingUserIllusts();
    fetchFollowingUserIllusts(null, true);
  };

  handleOnPressFindRecommendedUsers = () => {
    const { navigate } = this.props.navigation;
    navigate('RecommendedUsers', {
      navigation: this.props.navigation,
    });
  };

  render() {
    const {
      followingUserIllusts,
      items,
      user,
      screenProps: { strings },
    } = this.props;
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
      );
    }
    return (
      <IllustList
        data={{ ...followingUserIllusts, items }}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(state => {
  const { followingUserIllusts, auth: { user } } = state;
  return {
    followingUserIllusts,
    items: getFollowingUserIllustsItems(state),
    user,
  };
}, followingUserIllustsActionCreators)(FollowingUserIllusts);

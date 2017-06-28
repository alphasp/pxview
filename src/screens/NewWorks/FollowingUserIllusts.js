import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
import { connectLocalization } from '../../components/Localization';
import IllustList from '../../components/IllustList';
import * as followingUserIllustsActionCreators
  from '../../common/actions/followingUserIllusts';
import { getFollowingUserIllustsItems } from '../../common/selectors';

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
  recommendUserButtonContainer: {
    marginTop: 10,
  },
});

class FollowingUserIllusts extends Component {
  componentDidMount() {
    const {
      user,
      fetchFollowingUserIllusts,
      clearFollowingUserIllusts,
    } = this.props;
    clearFollowingUserIllusts();
    if (user) {
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
    const { followingUserIllusts, items, user, i18n } = this.props;
    if (!user) {
      return (
        <View style={styles.container}>
          <Icon name="users" size={40} style={styles.usersIcon} />
          <Text>{i18n.noFollowUser}</Text>
          <Text>{i18n.noNewWorkFollowSuggestion}</Text>
          <Button
            title={i18n.recommendedUsersFind}
            containerViewStyle={styles.recommendUserButtonContainer}
            backgroundColor="#5cafec"
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

export default connectLocalization(
  withNavigation(
    connect(state => {
      const { followingUserIllusts, auth: { user } } = state;
      return {
        followingUserIllusts,
        items: getFollowingUserIllustsItems(state),
        user,
      };
    }, followingUserIllustsActionCreators)(FollowingUserIllusts),
  ),
);

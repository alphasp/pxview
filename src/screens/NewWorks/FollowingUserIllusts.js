import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { Button } from 'react-native-elements';
import { connectLocalization } from '../../components/Localization';
import IllustList from '../../components/IllustList';
import EmptyStateView from '../../components/EmptyStateView';
import * as followingUserIllustsActionCreators from '../../common/actions/followingUserIllusts';
import { getFollowingUserIllustsItems } from '../../common/selectors';
import { SCREENS } from '../../common/constants';
import { globalStyleVariables } from '../../styles';

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
    navigate(SCREENS.RecommendedUsers);
  };

  render() {
    const { followingUserIllusts, items, user, i18n } = this.props;
    if (!user) {
      return (
        <EmptyStateView
          iconName="users"
          iconType="font-awesome"
          title={i18n.noFollowUser}
          description={i18n.noNewWorkFollowSuggestion}
          actionButton={
            <Button
              title={i18n.recommendedUsersFind}
              backgroundColor={globalStyleVariables.PRIMARY_COLOR}
              onPress={this.handleOnPressFindRecommendedUsers}
              raised
            />
          }
        />
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

import React, { Component } from 'react';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import IllustList from '../../components/IllustList';
import * as userIllustsActionCreators from '../../common/actions/userIllusts';
import { makeGetUserIllustsItems } from '../../common/selectors';

class UserIllusts extends Component {
  componentDidMount() {
    const {
      userIllusts,
      userId,
      fetchUserIllusts,
      clearUserIllusts,
    } = this.props;
    if (!userIllusts || !userIllusts.items) {
      clearUserIllusts(userId);
      InteractionManager.runAfterInteractions(() => {
        fetchUserIllusts(userId);
      });
    }
  }

  loadMoreItems = () => {
    const { userIllusts, userId, fetchUserIllusts } = this.props;
    if (userIllusts && !userIllusts.loading && userIllusts.nextUrl) {
      fetchUserIllusts(userId, userIllusts.nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { userId, fetchUserIllusts, clearUserIllusts } = this.props;
    clearUserIllusts(userId);
    fetchUserIllusts(userId, null, true);
  };

  render() {
    const { userIllusts, items } = this.props;
    return (
      <IllustList
        data={{ ...userIllusts, items }}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(() => {
  const getUserIllustsItems = makeGetUserIllustsItems();
  return (state, props) => {
    const { userIllusts } = state;
    const userId = props.userId || props.navigation.state.params.userId;
    return {
      userIllusts: userIllusts[userId],
      items: getUserIllustsItems(state, props),
      userId,
    };
  };
}, userIllustsActionCreators)(UserIllusts);

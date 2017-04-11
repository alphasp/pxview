import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import UserListContainer from './UserListContainer';
import * as userFollowerActionCreators from '../common/actions/userFollowers';
import { denormalizedData } from '../common/helpers/normalizrHelper';
import Schemas from '../common/constants/schemas';

const avatarSize = 50;

class UserFollowers extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    userFollowers: PropTypes.object.isRequired,
    fetchUserFollower: PropTypes.func.isRequired,
    clearUserFollower: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = { 
      refreshing: false
    };
  }

  componentDidMount() {
    const { fetchUserFollower, userId } = this.props;
    fetchUserFollower(userId);
  }

  loadMore = () => {
    const { fetchUserFollower, userFollowers, userId } = this.props;
    if (userFollowers && userFollowers.nextUrl) {
      fetchUserFollower(userId, userFollowers.nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { clearUserFollower, fetchUserFollower, userId } = this.props;
    this.setState({
      refereshing: true
    });
    clearUserFollower(userId);
    fetchUserFollower(userId).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { userFollowers, userId, navigation, screenProps } = this.props;
    const { refreshing } = this.state;
    return (
      <UserListContainer
        userList={userFollowers}
        refreshing={refreshing}
        loadMore={this.loadMore}
        onRefresh={this.handleOnRefresh}
        navigation={navigation}
        screenProps={screenProps}
      />
    );
  }
}

export default connect((state, props) => {
  const { entities, userFollowers } = state;
  const userId = props.userId || props.navigation.state.params.userId;
  return {
    userFollowers: denormalizedData(userFollowers[userId], 'items', Schemas.USER_PREVIEW_ARRAY, entities),
    userId
  }
}, userFollowerActionCreators)(UserFollowers);
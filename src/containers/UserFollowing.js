import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ListView,
  RecyclerViewBackedScrollView,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../components/Loader';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';
import PXThumbnail from '../components/PXThumbnail';
import PXThumbnailTouchable from '../components/PXThumbnailTouchable';
import OverlayImagePages from '../components/OverlayImagePages';
import UserListContainer from './UserListContainer';
import * as userFollowingActionCreators from '../common/actions/userFollowing';

class UserFollowing extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    userFollowing: PropTypes.object.isRequired,
    followingType: PropTypes.string.isRequired,
    fetchUserFollowing: PropTypes.func.isRequired,
    clearUserFollowing: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = { 
      refreshing: false
    };
  }

  componentDidMount() {
    const { fetchUserFollowing, userId, followingType } = this.props;
    fetchUserFollowing(userId, followingType);
  }

  loadMore = () => {
    const { fetchUserFollowing, userFollowing, userId } = this.props;
    if (userFollowing[userId] && userFollowing[userId].nextUrl) {
      fetchUserFollowing(userId, followingType, userFollowing[userId].nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { clearUserFollowing, fetchUserFollowing, userId, followingType } = this.props;
    this.setState({
      refereshing: true
    });
    clearUserFollowing(userId, followingType);
    fetchUserFollowing(userId, followingType).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { userFollowing, userId, navigation, screenProps } = this.props;
    const { refreshing } = this.state;
    return (
      userFollowing[userId] ?
      <UserListContainer
        userList={userFollowing[userId]}
        refreshing={refreshing}
        loadMore={this.loadMore}
        onRefresh={this.handleOnRefresh}
        navigation={navigation}
        screenProps={screenProps}
      />
      :
      null
    );
  }
}

export default connect((state, props) => {
  return {
    userFollowing: state.userFollowing[props.followingType]
  }
}, userFollowingActionCreators)(UserFollowing);
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
import * as userFollowerActionCreators from '../common/actions/userFollower';

const avatarSize = 50;

class UserFollower extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    userFollower: PropTypes.object.isRequired,
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
    const { fetchUserFollower, userFollower, userId } = this.props;
    if (userFollower[userId] && userFollower[userId].nextUrl) {
      fetchUserFollower(userId, userFollower[userId].nextUrl);
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
    const { userFollower, userId, navigation, screenProps } = this.props;
    const { refreshing } = this.state;
    return (
      userFollower[userId] ?
      <UserListContainer
        userList={userFollower[userId]}
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
    userFollower: state.userFollower
  }
}, userFollowerActionCreators)(UserFollower);
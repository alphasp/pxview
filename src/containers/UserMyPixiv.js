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
import * as userMyPixivActionCreators from '../common/actions/userMyPixiv';

class UserMyPixiv extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    userMyPixiv: PropTypes.object.isRequired,
    fetchUserMyPixiv: PropTypes.func.isRequired,
    clearUserMyPixiv: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = { 
      refreshing: false
    };
  }

  componentDidMount() {
    const { fetchUserMyPixiv, userId } = this.props;
    fetchUserMyPixiv(userId);
  }

  loadMore = () => {
    const { fetchUserMyPixiv, userMyPixiv, userId } = this.props;
    if (userMyPixiv[userId] && userMyPixiv[userId].nextUrl) {
      fetchUserMyPixiv(userId, userMyPixiv[userId].nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { clearUserMyPixiv, fetchUserMyPixiv, userId } = this.props;
    this.setState({
      refereshing: true
    });
    clearUserMyPixiv(userId);
    fetchUserMyPixiv(userId).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { userMyPixiv, userId, navigation, screenProps } = this.props;
    const { refreshing } = this.state;
    return (
      userMyPixiv[userId] ?
      <UserListContainer
        userList={userMyPixiv[userId]}
        refreshing={refreshing}
        loadMore={this.loadMore}
        onRefresh={this.handleOnRefresh}
        navigation={navigation}
        screenProps={navigation}
      />
      :
      null
    );
  }
}

export default connect((state, props) => {
  return {
    userMyPixiv: state.userMyPixiv
  }
}, userMyPixivActionCreators)(UserMyPixiv);
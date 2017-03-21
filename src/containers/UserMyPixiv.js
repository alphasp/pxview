import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import UserListContainer from './UserListContainer';
import * as userMyPixivActionCreators from '../common/actions/userMyPixiv';
import { denormalizedData } from '../common/helpers/normalizrHelper';
import Schemas from '../common/constants/schemas';

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
      <UserListContainer
        userList={userMyPixiv}
        refreshing={refreshing}
        loadMore={this.loadMore}
        onRefresh={this.handleOnRefresh}
        navigation={navigation}
        screenProps={navigation}
      />
    );
  }
}

export default connect((state, props) => {
  const { entities, userMyPixiv } = state;
  const userId = props.userId || props.navigation.state.params.userId;
  return {
    userMyPixiv: denormalizedData(userMyPixiv[userId], 'items', Schemas.USER_PREVIEW_ARRAY, entities),
    userId
  }
}, userMyPixivActionCreators)(UserMyPixiv);
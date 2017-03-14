import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  RecyclerViewBackedScrollView,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import IllustList from '../components/IllustList';
import { fetchUserMangas, clearUserMangas } from '../common/actions/userManga';

class UserManga extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch, userId } = this.props;
    dispatch(clearUserMangas(userId));
    dispatch(fetchUserMangas(userId));
  }

  loadMoreItems = () => {
    const { dispatch, userManga: { nextUrl }, userId } = this.props;
    console.log('load more ', nextUrl)
    if (nextUrl) {
      dispatch(fetchUserMangas(userId, nextUrl));
    }
  }

  handleOnRefresh = () => {
    const { dispatch, userId } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearUserMangas(userId));
    dispatch(fetchUserMangas(userId)).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { userManga, userId } = this.props;
    const { refreshing } = this.state;
    return (
      userManga[userId] ?
      <IllustList
        data={userManga[userId]}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
      :
      null
    );
  }
}

export default connect((state, props) => {
  return {
    userManga: state.userManga,
    userId: props.userId || props.navigation.state.params.userId
  }
})(UserManga);
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
import { fetchUserIllusts, clearUserIllusts } from '../common/actions/userIllust';

class UserIllust extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch, userId } = this.props;
    dispatch(clearUserIllusts(userId));
    dispatch(fetchUserIllusts(userId));
  }

  loadMoreItems = () => {
    const { dispatch, userIllust, userId } = this.props;
    if (userIllust[userId] && userIllust[userId].nextUrl) {
      dispatch(fetchUserIllusts(userId, userIllust[userId].nextUrl));
    }
  }

  handleOnRefresh = () => {
    const { dispatch, userId } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearUserIllusts(userId));
    dispatch(fetchUserIllusts(userId)).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { userIllust, userId } = this.props;
    const { refreshing } = this.state;
    console.log('userillust ', userIllust)
    return (
      <IllustList
        data={userIllust[userId]}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  return {
    userIllust: state.userIllust
  }
})(UserIllust);
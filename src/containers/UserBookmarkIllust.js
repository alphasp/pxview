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
import { fetchUserBookmarkIllusts, clearUserBookmarkIllusts } from '../common/actions/userBookmarkIllust';

class UserBookmarkIllust extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch, userId } = this.props;
    dispatch(clearUserBookmarkIllusts(userId));
    dispatch(fetchUserBookmarkIllusts(userId));
  }

  loadMoreItems = () => {
    const { dispatch, userBookmarkIllust, userId } = this.props;
    if (userBookmarkIllust[userId] && userBookmarkIllust[userId].nextUrl) {
      dispatch(fetchUserBookmarkIllusts(userId, userBookmarkIllust[userId].nextUrl));
    }
  }

  handleOnRefresh = () => {
    const { dispatch, userId } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearUserBookmarkIllusts(userId));
    dispatch(fetchUserBookmarkIllusts(userId)).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { userBookmarkIllust, userId } = this.props;
    const { refreshing } = this.state;
    console.log('userBookmarkIllust ', userBookmarkIllust)
    return (
      <IllustList
        data={userBookmarkIllust[userId]}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  return {
    userBookmarkIllust: state.userBookmarkIllust
  }
})(UserBookmarkIllust);
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
    const { dispatch, userId, tag } = this.props;
    dispatch(clearUserBookmarkIllusts(userId));
    dispatch(fetchUserBookmarkIllusts(userId, tag));
  }

  componentWillReceiveProps(nextProps) {
    const { userId: prevUserId, tag: prevTag } = this.props;
    const { dispatch, userId, tag } = nextProps;
    if ((userId !== prevUserId) || (tag !== prevTag)) {
      const { dataSource } = this.state;
      dispatch(clearUserBookmarkIllusts(userId));
      dispatch(fetchUserBookmarkIllusts(userId, tag));
    }
  }


  loadMoreItems = () => {
    const { dispatch, userBookmarkIllust, tag, userId } = this.props;
    if (userBookmarkIllust[userId] && userBookmarkIllust[userId].nextUrl) {
      dispatch(fetchUserBookmarkIllusts(userId, tag, userBookmarkIllust[userId].nextUrl));
    }
  }

  handleOnRefresh = () => {
    const { dispatch, userId, tag } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearUserBookmarkIllusts(userId));
    dispatch(fetchUserBookmarkIllusts(userId, tag)).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { userBookmarkIllust, userId, onScroll } = this.props;
    const { refreshing } = this.state;
    return (
      userBookmarkIllust[userId] ?
      <IllustList
        data={userBookmarkIllust[userId]}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
        onScroll={onScroll}
      />
      :
      null
    );
  }
}

export default connect((state, props) => {
  return {
    userBookmarkIllust: state.userBookmarkIllust,
    userId: props.userId || props.navigation.state.params.userId
  }
})(UserBookmarkIllust);
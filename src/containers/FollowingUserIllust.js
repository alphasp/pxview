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
import * as followingUserActionCreators from '../common/actions/followingUserIllust';

class FollowingUserIllust extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { fetchFollowingUserIllusts } = this.props;
    fetchFollowingUserIllusts();
  }

  loadMoreItems = () => {
    const { fetchFollowingUserIllusts, followingUserIllust: { nextUrl } } = this.props;
    console.log('load more ', nextUrl)
    if (nextUrl) {
      fetchFollowingUserIllusts("", nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { fetchFollowingUserIllusts, clearFollowingUserIllusts } = this.props;
    this.setState({
      refereshing: true
    });
    clearFollowingUserIllusts();
    fetchFollowingUserIllusts().finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { followingUserIllust } = this.props;
    const { refreshing } = this.state;
    return (
      <IllustList
        data={followingUserIllust}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(state => {
  return {
    followingUserIllust: state.followingUserIllust,
  }
}, followingUserActionCreators)(FollowingUserIllust);
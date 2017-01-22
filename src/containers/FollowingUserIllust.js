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
import { fetchFollowingUserIllusts, clearFollowingUserIllusts } from '../common/actions/followingUserIllust';

class FollowingUserIllust extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchFollowingUserIllusts());
  }

  loadMoreItems = () => {
    const { dispatch, followingUserIllust: { nextUrl } } = this.props;
    console.log('load more ', nextUrl)
    if (nextUrl) {
      dispatch(fetchFollowingUserIllusts("", nextUrl));
    }
  }

  handleOnRefresh = () => {
    const { dispatch } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearFollowingUserIllusts());
    dispatch(fetchFollowingUserIllusts()).finally(() => {
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
})(FollowingUserIllust);
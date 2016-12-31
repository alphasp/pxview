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
import { fetchMyPrivateBookmarkIllusts, clearMyPrivateBookmarkIllusts } from '../common/actions/myPrivateBookmarkIllust';

class MyPrivateBookmarkIllust extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch, userId, tag } = this.props;
    dispatch(clearMyPrivateBookmarkIllusts(userId));
    dispatch(fetchMyPrivateBookmarkIllusts(userId, tag));
  }

  componentWillReceiveProps(nextProps) {
    const { userId: prevUserId, tag: prevTag } = this.props;
    const { dispatch, userId, tag } = nextProps;
    if ((userId !== prevUserId) || (tag !== prevTag)) {
      const { dataSource } = this.state;
      dispatch(clearMyPrivateBookmarkIllusts(userId));
      dispatch(fetchMyPrivateBookmarkIllusts(userId, tag));
    }
  }


  loadMoreItems = () => {
    const { dispatch, myPrivateBookmarkIllust: { nextUrl }, tag, userId } = this.props;
    if (nextUrl) {
      dispatch(fetchMyPrivateBookmarkIllusts(userId, tag, nextUrl));
    }
  }

  handleOnRefresh = () => {
    const { dispatch, userId, tag } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearMyPrivateBookmarkIllusts(userId));
    dispatch(fetchMyPrivateBookmarkIllusts(userId, tag)).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { myPrivateBookmarkIllust, userId } = this.props;
    const { refreshing } = this.state;
    return (
      <IllustList
        data={myPrivateBookmarkIllust}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  return {
    myPrivateBookmarkIllust: state.myPrivateBookmarkIllust
  }
})(MyPrivateBookmarkIllust);
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
import { denormalize } from 'normalizr';
import IllustList from '../components/IllustList';
import * as userBookmarkIllustActionCreators from '../common/actions/userBookmarkIllust';
import Schemas from '../common/constants/schemas';

class UserBookmarkIllust extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { userId, tag, fetchUserBookmarkIllusts, clearUserBookmarkIllusts } = this.props;
    clearUserBookmarkIllusts(userId);
    fetchUserBookmarkIllusts(userId, tag);
  }

  componentWillReceiveProps(nextProps) {
    const { userId: prevUserId, tag: prevTag } = this.props;
    const { userId, tag, fetchUserBookmarkIllusts, clearUserBookmarkIllusts } = nextProps;
    if ((userId !== prevUserId) || (tag !== prevTag)) {
      const { dataSource } = this.state;
      clearUserBookmarkIllusts(userId);
      fetchUserBookmarkIllusts(userId, tag);
    }
  }


  loadMoreItems = () => {
    const { userBookmarkIllust, tag, userId, fetchUserBookmarkIllusts } = this.props;
    if (userBookmarkIllust[userId] && userBookmarkIllust[userId].nextUrl) {
      fetchUserBookmarkIllusts(userId, tag, userBookmarkIllust[userId].nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { userId, tag, clearUserBookmarkIllusts, fetchUserBookmarkIllusts } = this.props;
    this.setState({
      refereshing: true
    });
    clearUserBookmarkIllusts(userId);
    fetchUserBookmarkIllusts(userId, tag).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { userBookmarkIllust, userId } = this.props;
    const { refreshing } = this.state;
    return (
      <IllustList
        data={userBookmarkIllust}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

// export default connect((state, props) => {
//   return {
//     userBookmarkIllust: state.userBookmarkIllust,
//     userId: props.userId || props.navigation.state.params.userId
//   }
// })(UserBookmarkIllust);


const defaultItems = [];

export default connect((state, props) => {
  const { entities, userBookmarkIllust } = state;
  const userId = props.userId || props.navigation.state.params.userId;
  if (userBookmarkIllust[userId]) {
    const denormalizedItems = denormalize(userBookmarkIllust[userId].items, Schemas.ILLUST_ARRAY, entities);
    return {
      userBookmarkIllust: {
        ...userBookmarkIllust[userId],
        items: denormalizedItems || defaultItems
      },
      userId
    }
  }
  else {
    return {
      userBookmarkIllust: {},
      userId
    }
  }
}, userBookmarkIllustActionCreators)(UserBookmarkIllust);
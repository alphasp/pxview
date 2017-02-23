import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  RecyclerViewBackedScrollView,
  RefreshControl,
  InteractionManager,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import moment from 'moment';
import Loader from '../components/Loader';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';
import PXThumbnail from '../components/PXThumbnail';
import PXThumbnailTouchable from '../components/PXThumbnailTouchable';
import CommentList from '../components/CommentList';
import { 
  fetchIllustComments, 
  clearIllustComments, 
} from '../common/actions/illustComment';

class IllustComment extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      }),
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch, illustComment, illustId } = this.props;
    if (!illustComment[illustId] || !illustComment[illustId].items) {
      dispatch(clearIllustComments(illustId));
      InteractionManager.runAfterInteractions(() => {
        dispatch(fetchIllustComments(illustId));
      });
    }
  }

  loadMoreComments = () => {
    const { dispatch, illustComment, illustId } = this.props;
    console.log('load more ', illustComment[illustId].nextUrl)
    if (illustComment[illustId] && illustComment[illustId].nextUrl) {
      dispatch(fetchIllustComments(illustId, null, illustComment[illustId].nextUrl));
    }
  }

  handleOnRefresh = () => {
    const { dispatch, illustId } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearIllustComments(illustId));
    dispatch(fetchIllustComments(illustId)).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { illustComment, illustId, navigation, isFeatureInDetailPage, maxItems } = this.props;
    const { dataSource, refreshing } = this.state;
    console.log('comments ', illustComment[illustId])
    return (
      (illustComment[illustId] ? true : false) &&
      <CommentList
        data={illustComment[illustId]}
        refreshing={refreshing}
        loadMoreItems={!isFeatureInDetailPage ? this.loadMoreItems : null}
        onRefresh={!isFeatureInDetailPage ? this.handleOnRefresh : null}
        maxItems={isFeatureInDetailPage && maxItems}
        navigation={navigation}
      />
    );
  }
}

export default connect((state, props) => {
  const { illustId, navigation } = props;
  return {
    illustComment: state.illustComment,
    illustId: navigation.state.params.illustId || illustId
  }
})(IllustComment);
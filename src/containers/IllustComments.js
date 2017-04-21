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
import moment from 'moment';
import Loader from '../components/Loader';
import PXTouchable from '../components/PXTouchable';
import PXImage from '../components/PXImage';
import PXThumbnail from '../components/PXThumbnail';
import PXThumbnailTouchable from '../components/PXThumbnailTouchable';
import CommentList from '../components/CommentList';
import { denormalizedData } from '../common/helpers/normalizrHelper';
import * as illustCommentsActionCreators from '../common/actions/illustComments';
import Schemas from '../common/constants/schemas';

class IllustComments extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerBackTitle: null
    }
  };

  componentDidMount() {
    const { fetchIllustComments, clearIllustComments, illustComments, illustId } = this.props;
    if (!illustComments || !illustComments.items) {
      clearIllustComments(illustId);
      InteractionManager.runAfterInteractions(() => {
        fetchIllustComments(illustId);
      });
    }
  }

  loadMoreItems = () => {
    const { fetchIllustComments, illustComments, illustId } = this.props;
    if (illustComments && !illustComments.loading && illustComments.nextUrl) {
      console.log('load more ', illustComments.nextUrl)
      fetchIllustComments(illustId, null, illustComments.nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { fetchIllustComments, clearIllustComments, illustId } = this.props;
    clearIllustComments(illustId)
    fetchIllustComments(illustId, null, null, true);
  }

  render() {
    const { illustComments, illustId, navigation, isFeatureInDetailPage, maxItems } = this.props;
    return (
      illustComments ?
      <CommentList
        data={illustComments}
        loadMoreItems={!isFeatureInDetailPage ? this.loadMoreItems : null}
        onRefresh={!isFeatureInDetailPage ? this.handleOnRefresh : null}
        maxItems={isFeatureInDetailPage && maxItems}
        navigation={navigation}
      />
      :
      null
    );
  }
}

export default connect((state, props) => {
  const { entities, illustComments } = state;
  const illustId = props.illustId || props.navigation.state.params.illustId;
  return {
    illustComments: denormalizedData(illustComments[illustId], 'items', Schemas.ILLUST_COMMENT_ARRAY, entities),
    illustId
  }
}, illustCommentsActionCreators)(IllustComments);
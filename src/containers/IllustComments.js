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
import { 
  fetchIllustComments, 
  clearIllustComments, 
} from '../common/actions/illustComments';

class IllustComments extends Component {
  static navigationOptions = {
    header: ({ state, setParams, navigate, goBack }, defaultHeader) => {
      return {
        ...defaultHeader,
        backTitle: null
      }
    }
  }

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
    const { dispatch, illustComments, illustId } = this.props;
    InteractionManager.runAfterInteractions(() => {
      dispatch(clearIllustComments(illustId));
      dispatch(fetchIllustComments(illustId));
    });
  }

  loadMoreComments = () => {
    const { dispatch, illustComments, illustId } = this.props;
    console.log('load more ', illustComments[illustId].nextUrl)
    if (illustComments[illustId] && illustComments[illustId].nextUrl) {
      dispatch(fetchIllustComments(illustId, null, illustComments[illustId].nextUrl));
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
    const { illustComments, illustId, navigation, isFeatureInDetailPage, maxItems } = this.props;
    const { dataSource, refreshing } = this.state;
    return (
      (illustComments[illustId] ? true : false) &&
      <CommentList
        data={illustComments[illustId]}
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
    illustComments: state.illustComments,
    illustId: navigation.state.params.illustId || illustId
  }
})(IllustComments);
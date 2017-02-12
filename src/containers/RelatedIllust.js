import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  RecyclerViewBackedScrollView,
  RefreshControl,
  InteractionManager,
} from 'react-native';
import { connect } from 'react-redux';
import IllustList from '../components/IllustList';
import { fetchRelatedIllusts, clearRelatedIllusts } from '../common/actions/relatedIllust';

class RelatedIllust extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch, illustId } = this.props;
    dispatch(clearRelatedIllusts(illustId));
    InteractionManager.runAfterInteractions(() => {
      dispatch(fetchRelatedIllusts(illustId));
    });
  }

  loadMoreItems = () => {
    const { dispatch, relatedIllust, illustId } = this.props;
    console.log('load more ', relatedIllust[illustId].nextUrl)
    if (relatedIllust[illustId] && relatedIllust[illustId].nextUrl) {
      dispatch(fetchRelatedIllusts(illustId, null, relatedIllust[illustId].nextUrl));
    }
  }

  handleOnRefresh = () => {
    const { dispatch, illustId } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearRelatedIllusts(illustId));
    dispatch(fetchRelatedIllusts(illustId)).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { relatedIllust, illustId, isFeatureInDetailPage, maxItems, navigation } = this.props;
    const { refreshing } = this.state;
    return (
      (relatedIllust[illustId] ? true : false) &&
      <IllustList
        data={relatedIllust[illustId]}
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
    relatedIllust: state.relatedIllust,
    illustId: navigation.state.params.illustId || illustId
  }
})(RelatedIllust);
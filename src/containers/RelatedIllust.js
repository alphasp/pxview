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
import Recommended from './Recommended';
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
    const { relatedIllust, illustId } = this.props;
    const { refreshing } = this.state;
    return (
      (relatedIllust[illustId] ? true : false) &&
      <Recommended
        recommended={relatedIllust[illustId]}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  return {
    relatedIllust: state.relatedIllust
  }
})(RelatedIllust);
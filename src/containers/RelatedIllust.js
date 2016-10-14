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
import { fetchRelatedIllust, clearRelatedIllust } from '../common/actions/relatedIllust';

class RelatedIllust extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { dispatch, illustId } = this.props;
    dispatch(clearRelatedIllust());
    InteractionManager.runAfterInteractions(() => {
      console.log("fetchRelatedIllust ", illustId)
      dispatch(fetchRelatedIllust(illustId));
    });
  }

  loadMoreItems = () => {
    const { dispatch, relatedIllust: { nextUrl } } = this.props;
    console.log('load more ', nextUrl)
    if (nextUrl) {
      dispatch(fetchRelatedIllust(null, null, nextUrl));
    }
  }

  handleOnRefresh = () => {
    const { dispatch } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearRelatedIllust());
    dispatch(fetchRelatedIllust()).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { relatedIllust, illustId } = this.props;
    const { refreshing } = this.state;
    console.log('rr ', relatedIllust)
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
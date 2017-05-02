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
import * as relatedIllustsActionCreators from '../common/actions/relatedIllusts';
import { makeGetRelatedIllustsItems } from '../common/selectors';

const styles = StyleSheet.create({
  nullResultContainer: {
    alignItems: 'center',
  },
});

class RelatedIllusts extends Component {
  componentDidMount() {
    const { relatedIllusts, illustId, fetchRelatedIllusts, clearRelatedIllusts } = this.props;
    // will render blank unless scrolled
    // https://github.com/facebook/react-native/issues/10142
    if (!relatedIllusts || !relatedIllusts.items) {
      clearRelatedIllusts(illustId);
      InteractionManager.runAfterInteractions(() => {
        fetchRelatedIllusts(illustId);
      });
    }
  }

  loadMoreItems = () => {
    const { relatedIllusts, illustId, fetchRelatedIllusts } = this.props;
    if (relatedIllusts && !relatedIllusts.loading && relatedIllusts.nextUrl) {
      console.log('load more ', relatedIllusts.nextUrl);
      fetchRelatedIllusts(illustId, null, relatedIllusts.nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { illustId, fetchRelatedIllusts, clearRelatedIllusts } = this.props;
    clearRelatedIllusts(illustId);
    fetchRelatedIllusts(illustId, null, null, true);
  }

  render() {
    const { relatedIllusts, items, illustId, isFeatureInDetailPage, maxItems, navigation } = this.props;
    return (
      <IllustList
        data={{ ...relatedIllusts, items }}
        loadMoreItems={!isFeatureInDetailPage ? this.loadMoreItems : null}
        onRefresh={!isFeatureInDetailPage ? this.handleOnRefresh : null}
        maxItems={isFeatureInDetailPage && maxItems}
      />
    );
  }
}

const defaultItems = [];


export default connect(() => {
  const getRelatedIllustsItems = makeGetRelatedIllustsItems();
  return (state, props) => {
    const { relatedIllusts } = state;
    const illustId = props.illustId || props.navigation.state.params.illustId;
    return {
      relatedIllusts: relatedIllusts[illustId],
      items: getRelatedIllustsItems(state, props),
      illustId,
    };
  };
}, relatedIllustsActionCreators)(RelatedIllusts);

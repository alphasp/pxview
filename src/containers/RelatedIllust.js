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
import { denormalize } from 'normalizr';
import IllustList from '../components/IllustList';
import * as relatedIllustActionCreators from '../common/actions/relatedIllust';
import Schemas from '../common/constants/schemas';

const styles = StyleSheet.create({
  nullResultContainer: {
    alignItems: 'center'
  }
});

class RelatedIllust extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { relatedIllust, illustId, fetchRelatedIllusts, clearRelatedIllusts } = this.props;
    // will render blank unless scrolled
    // https://github.com/facebook/react-native/issues/10142
    // if (!relatedIllust) {
    //   clearRelatedIllusts(illustId);
    //   InteractionManager.runAfterInteractions(() => {
    //     fetchRelatedIllusts(illustId);
    //   });
    // }
    InteractionManager.runAfterInteractions(() => {
      clearRelatedIllusts(illustId);
      fetchRelatedIllusts(illustId);
    });
  }

  loadMoreItems = () => {
    const { relatedIllust, illustId, fetchRelatedIllusts } = this.props;
    console.log('load more ', relatedIllust.nextUrl)
    if (relatedIllust && relatedIllust.nextUrl) {
      fetchRelatedIllusts(illustId, null, relatedIllust.nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { illustId, fetchRelatedIllusts, clearRelatedIllusts } = this.props;
    this.setState({
      refereshing: true
    });
    clearRelatedIllusts(illustId);
    fetchRelatedIllusts(illustId).finally(() => {
      this.setState({
        refereshing: false
      }); 
    });
  }

  render() {
    const { relatedIllust, illustId, isFeatureInDetailPage, maxItems, navigation } = this.props;
    const { refreshing } = this.state;
    if (!relatedIllust) {
      return null;
    }
    return (
      <IllustList
        data={relatedIllust}
        refreshing={refreshing}
        loadMoreItems={!isFeatureInDetailPage ? this.loadMoreItems : null}
        onRefresh={!isFeatureInDetailPage ? this.handleOnRefresh : null}
        maxItems={isFeatureInDetailPage && maxItems}
        navigation={navigation}
      />
    );
  }
}

const defaultItems = [];
export default connect((state, props) => {
  const { entities, relatedIllust } = state;
  const illustId = props.navigation.state.params.illustId || props.illustId;
  if (relatedIllust[illustId]) {
    const denormalizedItems = denormalize(relatedIllust[illustId].items, Schemas.ILLUST_ARRAY, entities);
    return {
      relatedIllust: {
        ...relatedIllust[illustId],
        items: denormalizedItems || defaultItems
      },
      illustId
    }
  }
  else {
    return {
      relatedIllust: null,
      illustId
    }
  }
}, relatedIllustActionCreators)(RelatedIllust);
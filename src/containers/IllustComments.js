import React, { Component } from 'react';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import CommentList from '../components/CommentList';
import * as illustCommentsActionCreators
  from '../common/actions/illustComments';
import { makeGetIllustCommentsItems } from '../common/selectors';

class IllustComments extends Component {
  componentDidMount() {
    const {
      fetchIllustComments,
      clearIllustComments,
      illustComments,
      illustId,
    } = this.props;
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
      console.log('load more ', illustComments.nextUrl);
      fetchIllustComments(illustId, null, illustComments.nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { fetchIllustComments, clearIllustComments, illustId } = this.props;
    clearIllustComments(illustId);
    fetchIllustComments(illustId, null, null, true);
  };

  render() {
    const {
      illustComments,
      items,
      navigation,
      isFeatureInDetailPage,
      maxItems,
    } = this.props;
    return (
      <CommentList
        data={{ ...illustComments, items }}
        loadMoreItems={!isFeatureInDetailPage ? this.loadMoreItems : null}
        onRefresh={!isFeatureInDetailPage ? this.handleOnRefresh : null}
        maxItems={isFeatureInDetailPage && maxItems}
        navigation={navigation}
      />
    );
  }
}

export default connect(() => {
  const getIllustCommentsItems = makeGetIllustCommentsItems();
  return (state, props) => {
    const { illustComments } = state;
    const illustId = props.illustId || props.navigation.state.params.illustId;
    return {
      illustComments: illustComments[illustId],
      items: getIllustCommentsItems(state, props),
      illustId,
    };
  };
}, illustCommentsActionCreators)(IllustComments);

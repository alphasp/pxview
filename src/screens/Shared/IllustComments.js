import React, { Component } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  InteractionManager,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import IllustCommentReplies from '../../containers/IllustCommentReplies';
import enhancePostComment from '../../components/HOC/enhancePostComment';
import CommentList from '../../components/CommentList';
import ViewMoreButton from '../../components/ViewMoreButton';
import Loader from '../../components/Loader';
import * as illustCommentsActionCreators from '../../common/actions/illustComments';
import { makeGetIllustCommentsItems } from '../../common/selectors';
import { globalStyles } from '../../styles';
import { SCREENS } from '../../common/constants';

const styles = StyleSheet.create({
  viewMoreButtonContainer: {
    marginTop: 10,
  },
  textInput: {
    flex: 1,
    margin: 10,
  },
});

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

  componentDidUpdate(prevProps) {
    const {
      route,
      navigation: { setParams },
      illustId,
    } = this.props;
    const { route: prevRoute } = prevProps;
    if (
      route.params?.reload &&
      !prevRoute.params?.reload &&
      route.params?.fromId === illustId
    ) {
      this.handleOnSubmitComment();
      setParams({
        reload: false,
        fromId: null,
      });
    }
  }

  loadMoreItems = () => {
    const { fetchIllustComments, illustComments, illustId } = this.props;
    if (illustComments && !illustComments.loading && illustComments.nextUrl) {
      fetchIllustComments(illustId, null, illustComments.nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { fetchIllustComments, clearIllustComments, illustId } = this.props;
    clearIllustComments(illustId);
    fetchIllustComments(illustId, null, null, true);
  };

  handleOnPressViewMoreComments = () => {
    const {
      illustId,
      authorId,
      navigation: { push },
    } = this.props;
    push(SCREENS.IllustComments, {
      illustId,
      authorId,
    });
  };

  handleOnPressCommentButton = () => {
    const {
      checkIfUserEligibleToPostComment,
      illustId,
      navigation: { navigate },
      route,
    } = this.props;
    const isEligible = checkIfUserEligibleToPostComment();
    if (isEligible) {
      navigate(SCREENS.AddIllustComment, {
        illustId,
        navigateFrom: {
          name: route.name,
          key: route.key,
        },
      });
    }
  };

  handleOnPressReplyCommentButton = (commentItem) => {
    const {
      checkIfUserEligibleToPostComment,
      illustId,
      authorId,
      navigation: { navigate },
      route,
    } = this.props;
    const isEligible = checkIfUserEligibleToPostComment();
    if (isEligible) {
      navigate(SCREENS.ReplyIllustComment, {
        illustId,
        authorId,
        commentItem,
        navigateFrom: {
          name: route.name,
          key: route.key,
        },
      });
    }
  };

  handleOnSubmitComment = () => {
    const { illustId, fetchIllustComments, clearIllustComments } = this.props;
    clearIllustComments(illustId);
    fetchIllustComments(illustId);
  };

  renderCommentReplies = (commentId) => {
    const { authorId, navigation } = this.props;
    return (
      <IllustCommentReplies
        commentId={commentId}
        authorId={authorId}
        navigation={navigation}
      />
    );
  };

  renderCommentButtonIcon = () => {
    return <Icon name="pencil" size={24} color="#737373" />;
  };

  render() {
    const {
      authorId,
      illustComments,
      items,
      verificationEmail,
      user,
      navigation,
      isFeatureInDetailPage,
      isDetailPageReady,
      maxItems,
    } = this.props;
    return (
      <SafeAreaView style={globalStyles.container}>
        {isFeatureInDetailPage && !isDetailPageReady && <Loader />}
        {(!isFeatureInDetailPage || isDetailPageReady) && (
          <CommentList
            authorId={authorId}
            data={{ ...illustComments, items }}
            loadMoreItems={!isFeatureInDetailPage ? this.loadMoreItems : null}
            onRefresh={!isFeatureInDetailPage ? this.handleOnRefresh : null}
            maxItems={isFeatureInDetailPage && maxItems}
            navigation={navigation}
            user={user}
            renderCommentReplies={this.renderCommentReplies}
            onPressReplyCommentButton={this.handleOnPressReplyCommentButton}
          />
        )}
        {isFeatureInDetailPage && isDetailPageReady && (
          <View style={styles.viewMoreButtonContainer}>
            <ViewMoreButton onPress={this.handleOnPressViewMoreComments} />
          </View>
        )}
        {!isFeatureInDetailPage && (
          <ActionButton
            buttonColor="#fff"
            renderIcon={this.renderCommentButtonIcon}
            fixNativeFeedbackRadius
            onPress={this.handleOnPressCommentButton}
          />
        )}
        <OverlaySpinner visible={verificationEmail.loading} />
      </SafeAreaView>
    );
  }
}

export default enhancePostComment(
  connect(() => {
    const getIllustCommentsItems = makeGetIllustCommentsItems();
    return (state, props) => {
      const { illustComments } = state;
      const illustId = props.illustId || props.route.params.illustId;
      const authorId = props.authorId || props.route.params.authorId;
      return {
        illustComments: illustComments[illustId],
        items: getIllustCommentsItems(state, props),
        illustId,
        authorId,
      };
    };
  }, illustCommentsActionCreators)(IllustComments),
);

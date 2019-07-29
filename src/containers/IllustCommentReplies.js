import React, { Component } from 'react';
import { View, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import enhancePostComment from '../components/HOC/enhancePostComment';
import CommentList from '../components/CommentList';
import ViewRepliesButton from '../components/ViewRepliesButton';
import * as illustCommentRepliesActionCreators from '../common/actions/illustCommentReplies';
import { makeGetIllustCommentRepliesItems } from '../common/selectors';
import { SCREENS } from '../common/constants';
import { globalStyles } from '../styles';

class IllustCommentReplies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowReplies: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { isShowReplies: prevIsShowReplies } = prevState;
    const { isShowReplies } = this.state;
    if (isShowReplies && !prevIsShowReplies) {
      const {
        fetchIllustCommentReplies,
        clearIllustCommentReplies,
        illustCommentReplies,
        commentId,
      } = this.props;
      if (!illustCommentReplies || !illustCommentReplies.items) {
        clearIllustCommentReplies(commentId);
        InteractionManager.runAfterInteractions(() => {
          fetchIllustCommentReplies(commentId);
        });
      }
    }
  }

  loadMoreItems = () => {
    const {
      fetchIllustCommentReplies,
      illustCommentReplies,
      commentId,
    } = this.props;
    if (
      illustCommentReplies &&
      !illustCommentReplies.loading &&
      illustCommentReplies.nextUrl
    ) {
      fetchIllustCommentReplies(commentId, null, illustCommentReplies.nextUrl);
    }
  };

  handleOnPressViewReplies = () => {
    this.setState({
      isShowReplies: true,
    });
  };

  handleOnPressReplyCommentButton = commentItem => {
    const { checkIfUserEligibleToPostComment } = this.props;
    const isEligible = checkIfUserEligibleToPostComment();
    if (isEligible) {
      const {
        illustId,
        authorId,
        navigation: { navigate },
      } = this.props;
      navigate(SCREENS.ReplyIllustComment, {
        illustId,
        authorId,
        commentItem,
        onSubmitComment: this.handleOnSubmitComment,
      });
    }
  };

  handleOnSubmitComment = () => {
    const {
      commentId,
      fetchIllustCommentReplies,
      clearIllustCommentReplies,
    } = this.props;
    clearIllustCommentReplies(commentId);
    fetchIllustCommentReplies(commentId);
  };

  render() {
    const {
      authorId,
      illustCommentReplies,
      items,
      user,
      navigation,
    } = this.props;
    const { isShowReplies } = this.state;
    return (
      <View style={globalStyles.container}>
        {!isShowReplies ? (
          <ViewRepliesButton onPress={this.handleOnPressViewReplies} />
        ) : (
          <CommentList
            authorId={authorId}
            data={{ ...illustCommentReplies, items, refreshing: false }}
            loadMoreItems={this.loadMoreItems}
            navigation={navigation}
            user={user}
            onPressReplyCommentButton={this.handleOnPressReplyCommentButton}
          />
        )}
      </View>
    );
  }
}

export default enhancePostComment(
  connect(
    () => {
      const getIllustCommentRepliesItems = makeGetIllustCommentRepliesItems();
      return (state, props) => {
        const { illustCommentReplies } = state;
        const { commentId } = props;
        return {
          illustCommentReplies: illustCommentReplies[commentId],
          items: getIllustCommentRepliesItems(state, props),
        };
      };
    },
    illustCommentRepliesActionCreators,
  )(IllustCommentReplies),
);

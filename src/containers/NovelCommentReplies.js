import React, { Component } from 'react';
import { View, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import enhancePostComment from '../components/HOC/enhancePostComment';
import CommentList from '../components/CommentList';
import ViewRepliesButton from '../components/ViewRepliesButton';
import * as novelCommentRepliesActionCreators from '../common/actions/novelCommentReplies';
import { makeGetNovelCommentRepliesItems } from '../common/selectors';
import { SCREENS } from '../common/constants';
import { globalStyles } from '../styles';

class NovelCommentReplies extends Component {
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
        fetchNovelCommentReplies,
        clearNovelCommentReplies,
        novelCommentReplies,
        commentId,
      } = this.props;
      if (!novelCommentReplies || !novelCommentReplies.items) {
        clearNovelCommentReplies(commentId);
        InteractionManager.runAfterInteractions(() => {
          fetchNovelCommentReplies(commentId);
        });
      }
    }
  }

  loadMoreItems = () => {
    const {
      fetchNovelCommentReplies,
      novelCommentReplies,
      commentId,
    } = this.props;
    if (
      novelCommentReplies &&
      !novelCommentReplies.loading &&
      novelCommentReplies.nextUrl
    ) {
      fetchNovelCommentReplies(commentId, null, novelCommentReplies.nextUrl);
    }
  };

  handleOnPressViewReplies = () => {
    this.setState({
      isShowReplies: true,
    });
  };

  handleOnPressReplyCommentButton = (commentItem) => {
    const { checkIfUserEligibleToPostComment } = this.props;
    const isEligible = checkIfUserEligibleToPostComment();
    if (isEligible) {
      const {
        novelId,
        authorId,
        navigation: { navigate },
      } = this.props;
      navigate(SCREENS.ReplyIllustComment, {
        novelId,
        authorId,
        commentItem,
        onSubmitComment: this.handleOnSubmitComment,
      });
    }
  };

  handleOnSubmitComment = () => {
    const {
      commentId,
      fetchNovelCommentReplies,
      clearNovelCommentReplies,
    } = this.props;
    clearNovelCommentReplies(commentId);
    fetchNovelCommentReplies(commentId);
  };

  render() {
    const {
      authorId,
      novelCommentReplies,
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
            data={{ ...novelCommentReplies, items, refreshing: false }}
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
  connect(() => {
    const getNovelCommentRepliesItems = makeGetNovelCommentRepliesItems();
    return (state, props) => {
      const { novelCommentReplies } = state;
      const { commentId } = props;
      return {
        novelCommentReplies: novelCommentReplies[commentId],
        items: getNovelCommentRepliesItems(state, props),
      };
    };
  }, novelCommentRepliesActionCreators)(NovelCommentReplies),
);

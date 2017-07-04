import React, { Component } from 'react';
import { View, StyleSheet, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import CommentList from '../../components/CommentList';
import ViewMoreButton from '../../components/ViewMoreButton';
import * as illustCommentsActionCreators
  from '../../common/actions/illustComments';
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
    const { illustId, navigation: { navigate } } = this.props;
    navigate(SCREENS.IllustComments, {
      illustId,
    });
  };

  handleOnPressCommentButton = () => {
    const { illustId, user, navigation: { navigate, goBack } } = this.props;
    if (!user) {
      navigate(SCREENS.Login, {
        onLoginSuccess: () => {
          goBack();
          setTimeout(() => {
            navigate(SCREENS.AddIllustComment, {
              illustId,
              onSubmitComment: this.handleOnSubmitComment,
            });
          }, 0);
        },
      });
    } else {
      navigate(SCREENS.AddIllustComment, {
        illustId,
        onSubmitComment: this.handleOnSubmitComment,
      });
    }
  };

  handleOnSubmitComment = () => {
    const { illustId, fetchIllustComments, clearIllustComments } = this.props;
    clearIllustComments(illustId);
    fetchIllustComments(illustId);
  };

  render() {
    const {
      illustComments,
      items,
      user,
      navigation,
      isFeatureInDetailPage,
      maxItems,
    } = this.props;
    return (
      <View style={globalStyles.container}>
        <CommentList
          data={{ ...illustComments, items }}
          loadMoreItems={!isFeatureInDetailPage ? this.loadMoreItems : null}
          onRefresh={!isFeatureInDetailPage ? this.handleOnRefresh : null}
          maxItems={isFeatureInDetailPage && maxItems}
          navigation={navigation}
          user={user}
        />
        {isFeatureInDetailPage &&
          <View style={styles.viewMoreButtonContainer}>
            <ViewMoreButton onPress={this.handleOnPressViewMoreComments} />
          </View>}
        {!isFeatureInDetailPage &&
          <ActionButton
            buttonColor="#fff"
            icon={<Icon name="pencil" size={24} color="#737373" />}
            onPress={this.handleOnPressCommentButton}
          />}
      </View>
    );
  }
}

export default connect(() => {
  const getIllustCommentsItems = makeGetIllustCommentsItems();
  return (state, props) => {
    const { illustComments, auth } = state;
    const illustId = props.illustId || props.navigation.state.params.illustId;
    return {
      illustComments: illustComments[illustId],
      items: getIllustCommentsItems(state, props),
      illustId,
      user: auth.user,
    };
  };
}, illustCommentsActionCreators)(IllustComments);

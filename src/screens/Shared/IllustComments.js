import React, { Component } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  InteractionManager,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import { connectLocalization } from '../../components/Localization';
import CommentList from '../../components/CommentList';
import ViewMoreButton from '../../components/ViewMoreButton';
import * as illustCommentsActionCreators from '../../common/actions/illustComments';
import * as verificationEmailActionCreators from '../../common/actions/verificationEmail';
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
    const { illustId, authorId, navigation: { navigate } } = this.props;
    navigate(SCREENS.IllustComments, {
      illustId,
      authorId,
    });
  };

  handleOnPressCommentButton = () => {
    const { illustId, user, navigation: { navigate }, i18n } = this.props;
    if (!user.mail_address) {
      Alert.alert(
        i18n.commentAdd,
        i18n.commentRequireAccountRegistration,
        [
          { text: i18n.cancel },
          {
            text: i18n.commentRequireAccountRegistrationAction,
            onPress: this.handleOnPressRegisterAccount,
          },
        ],
        { cancelable: false },
      );
    } else if (user.mail_address && !user.is_mail_authorized) {
      Alert.alert(
        i18n.emailVerificationPostComment,
        null,
        [
          { text: i18n.cancel },
          {
            text: i18n.emailVerificationSend,
            onPress: this.handleOnPressSendVerificationEmail,
          },
        ],
        { cancelable: false },
      );
    } else {
      navigate(SCREENS.AddIllustComment, {
        illustId,
        onSubmitComment: this.handleOnSubmitComment,
      });
    }
  };

  handleOnPressSendVerificationEmail = () => {
    const { sendVerificationEmail } = this.props;
    sendVerificationEmail();
  };

  handleOnPressRegisterAccount = () => {
    const { navigate } = this.props.navigation;
    navigate(SCREENS.AccountSettingsModal, {
      hideAdvanceSettings: true,
    });
  };

  handleOnSubmitComment = () => {
    const { illustId, fetchIllustComments, clearIllustComments } = this.props;
    clearIllustComments(illustId);
    fetchIllustComments(illustId);
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
      maxItems,
    } = this.props;
    return (
      <SafeAreaView style={globalStyles.container}>
        <CommentList
          authorId={authorId}
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
            fixNativeFeedbackRadius
            onPress={this.handleOnPressCommentButton}
          />}
        <OverlaySpinner visible={verificationEmail.loading} />
      </SafeAreaView>
    );
  }
}

export default connectLocalization(
  connect(
    () => {
      const getIllustCommentsItems = makeGetIllustCommentsItems();
      return (state, props) => {
        const { illustComments, auth } = state;
        const illustId =
          props.illustId || props.navigation.state.params.illustId;
        const authorId =
          props.authorId || props.navigation.state.params.authorId;
        return {
          illustComments: illustComments[illustId],
          items: getIllustCommentsItems(state, props),
          verificationEmail: state.verificationEmail,
          illustId,
          authorId,
          user: auth.user,
        };
      };
    },
    { ...illustCommentsActionCreators, ...verificationEmailActionCreators },
  )(IllustComments),
);

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
import * as novelCommentsActionCreators from '../../common/actions/novelComments';
import * as verificationEmailActionCreators from '../../common/actions/verificationEmail';
import { makeGetNovelCommentsItems } from '../../common/selectors';
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

class NovelComments extends Component {
  componentDidMount() {
    const {
      fetchNovelComments,
      clearNovelComments,
      novelComments,
      novelId,
    } = this.props;
    if (!novelComments || !novelComments.items) {
      clearNovelComments(novelId);
      InteractionManager.runAfterInteractions(() => {
        fetchNovelComments(novelId);
      });
    }
  }

  loadMoreItems = () => {
    const { fetchNovelComments, novelComments, novelId } = this.props;
    if (novelComments && !novelComments.loading && novelComments.nextUrl) {
      fetchNovelComments(novelId, null, novelComments.nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { fetchNovelComments, clearNovelComments, novelId } = this.props;
    clearNovelComments(novelId);
    fetchNovelComments(novelId, null, null, true);
  };

  handleOnPressViewMoreComments = () => {
    const { novelId, navigation: { navigate } } = this.props;
    navigate(SCREENS.NovelComments, {
      novelId,
    });
  };

  handleOnPressCommentButton = () => {
    const { novelId, user, navigation: { navigate }, i18n } = this.props;
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
        novelId,
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
    const { novelId, fetchNovelComments, clearNovelComments } = this.props;
    clearNovelComments(novelId);
    fetchNovelComments(novelId);
  };

  render() {
    const {
      novelComments,
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
          data={{ ...novelComments, items }}
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
            fixNativeFeedbackRadius
          />}
        <OverlaySpinner visible={verificationEmail.loading} />
      </SafeAreaView>
    );
  }
}

export default connectLocalization(
  connect(
    () => {
      const getNovelCommentsItems = makeGetNovelCommentsItems();
      return (state, props) => {
        const { novelComments, auth } = state;
        const novelId = props.novelId || props.navigation.state.params.novelId;
        return {
          novelComments: novelComments[novelId],
          items: getNovelCommentsItems(state, props),
          verificationEmail: state.verificationEmail,
          novelId,
          user: auth.user,
        };
      };
    },
    { ...novelCommentsActionCreators, ...verificationEmailActionCreators },
  )(NovelComments),
);

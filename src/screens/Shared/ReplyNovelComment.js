import React, { Component } from 'react';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { withTheme, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import { CommonActions } from '@react-navigation/native';
import { connectLocalization } from '../../components/Localization';
import PXThumbnail from '../../components/PXThumbnail';
import PXTouchable from '../../components/PXTouchable';
import * as addNovelCommentActionCreators from '../../common/actions/addNovelComment';
import { globalStyles, globalStyleVariables } from '../../styles';

const styles = StyleSheet.create({
  replyToContainer: {
    flexDirection: 'row',
    margin: 10,
    padding: 10,
    borderLeftWidth: 8,
    borderLeftColor: globalStyleVariables.PRIMARY_COLOR,
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
    borderRadius: 5,
  },
  nameCommentContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
  },
  authorBadge: {
    backgroundColor: globalStyleVariables.PRIMARY_COLOR,
    marginLeft: 5,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  authorBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  comment: {
    marginTop: 10,
  },
  textInput: {
    flex: 1,
    margin: 10,
    textAlignVertical: 'top',
  },
});

class ReplyNovelComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: '',
    };
  }

  componentDidMount() {
    this.setHeaderRight();
  }

  componentDidUpdate(prevProps) {
    const { result, navigation, route } = this.props;
    const { result: prevResult } = prevProps;
    if (result !== prevResult && result.success) {
      const { navigateFrom, novelId } = route.params;
      navigation.dispatch(
        CommonActions.navigate({
          name: navigateFrom.name,
          key: navigateFrom.key,
          params: {
            reload: true,
            fromId: novelId,
          },
        }),
      );
    }
  }

  setHeaderRight = () => {
    const {
      navigation: { setOptions },
    } = this.props;
    const { comment } = this.state;
    setOptions({
      headerRight: () => (
        <PXTouchable onPress={this.handleOnSubmitComment} disabled={!comment}>
          <Icon
            name="pencil"
            style={{ padding: 10 }}
            size={20}
            color={comment ? '#fff' : 'gray'}
          />
        </PXTouchable>
      ),
    });
  };

  handleOnChangeComment = (text) => {
    this.setState(
      {
        comment: text,
      },
      () => {
        this.setHeaderRight();
      },
    );
  };

  handleOnSubmitComment = () => {
    const { addNovelComment, route } = this.props;
    const { novelId, commentItem } = route.params;
    const { comment } = this.state;
    Keyboard.dismiss();
    addNovelComment(novelId, comment, commentItem.id);
  };

  renderReplyToComment = () => {
    const { i18n, route } = this.props;
    const { commentItem, authorId } = route.params;
    return (
      <View style={styles.replyToContainer}>
        <PXThumbnail uri={commentItem.user.profile_image_urls.medium} />
        <View style={styles.nameCommentContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{commentItem.user.name}</Text>
            {commentItem.user.id === authorId && (
              <View style={styles.authorBadge}>
                <Text style={styles.authorBadgeText}>
                  {i18n.commentWorkAuthor}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.comment}>
            <Text>{commentItem.comment}</Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const {
      i18n,
      result: { loading },
      theme,
    } = this.props;
    const { comment } = this.state;
    return (
      <View
        style={[
          globalStyles.container,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        {this.renderReplyToComment()}
        <TextInput
          multiline
          autoFocus
          maxLength={140}
          placeholder={i18n.commentInput}
          underlineColorAndroid="transparent"
          style={styles.textInput}
          onChangeText={this.handleOnChangeComment}
          value={comment}
        />
        <OverlaySpinner visible={loading} />
      </View>
    );
  }
}

export default withTheme(
  connectLocalization(
    connect(
      (state) => ({
        result: state.addNovelComment,
      }),
      addNovelCommentActionCreators,
    )(ReplyNovelComment),
  ),
);

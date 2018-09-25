import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import { connectLocalization } from '../../components/Localization';
import PXThumbnail from '../../components/PXThumbnail';
import PXTouchable from '../../components/PXTouchable';
import * as addIllustCommentActionCreators from '../../common/actions/addIllustComment';
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

class ReplyIllustComment extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    const { submit, comment, illustId } = state.params;
    return {
      headerRight:
        submit &&
        illustId &&
        <PXTouchable onPress={submit} disabled={!comment}>
          <Icon
            name="pencil"
            style={{ padding: 10 }}
            size={20}
            color={comment ? '#fff' : 'gray'}
          />
        </PXTouchable>,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      comment: '',
    };
  }

  componentDidMount() {
    const { navigation: { setParams } } = this.props;
    setParams({
      submit: this.handleOnSubmitComment,
      comment: '',
    });
  }

  componentWillReceiveProps(nextProps) {
    const { result: prevResult } = this.props;
    const { result, navigation: { goBack, state } } = nextProps;
    if (result !== prevResult && result.success) {
      const { onSubmitComment } = state.params;
      goBack();
      onSubmitComment();
    }
  }

  handleOnChangeComment = text => {
    const { setParams } = this.props.navigation;
    this.setState({
      comment: text,
    });
    setParams({
      comment: text,
    });
  };

  handleOnSubmitComment = () => {
    const { addIllustComment, navigation } = this.props;
    const { illustId, commentItem } = navigation.state.params;
    const { comment } = this.state;
    Keyboard.dismiss();
    addIllustComment(illustId, comment, commentItem.id);
  };

  renderReplyToComment = () => {
    const { i18n, navigation } = this.props;
    const { commentItem, authorId } = navigation.state.params;
    return (
      <View style={styles.replyToContainer}>
        <PXThumbnail uri={commentItem.user.profile_image_urls.medium} />
        <View style={styles.nameCommentContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              {commentItem.user.name}
            </Text>
            {commentItem.user.id === authorId &&
              <View style={styles.authorBadge}>
                <Text style={styles.authorBadgeText}>
                  {i18n.commentWorkAuthor}
                </Text>
              </View>}
          </View>
          <View style={styles.comment}>
            <Text>
              {commentItem.comment}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const { i18n, result: { loading }, theme } = this.props;
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
          placeholderTextColor="#86939e"
          underlineColorAndroid="transparent"
          style={[styles.textInput, { color: theme.colors.text }]}
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
      state => ({
        result: state.addIllustComment,
      }),
      addIllustCommentActionCreators,
    )(ReplyIllustComment),
  ),
);

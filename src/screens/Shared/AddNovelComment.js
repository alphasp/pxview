import React, { Component } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { withTheme, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import { connectLocalization } from '../../components/Localization';
import PXTouchable from '../../components/PXTouchable';
import * as addNovelCommentActionCreators from '../../common/actions/addNovelComment';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    flex: 1,
    margin: 10,
    textAlignVertical: 'top',
  },
});

class AddNovelComment extends Component {
  static options = ({ navigation }) => {
    const { state } = navigation;
    const { submit, comment, novelId } = state.params;
    return {
      headerRight: submit && novelId && (
        <PXTouchable onPress={submit} disabled={!comment}>
          <Icon
            name="pencil"
            style={{ padding: 10 }}
            size={20}
            color={comment ? '#fff' : 'gray'}
          />
        </PXTouchable>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      comment: '',
    };
  }

  componentDidMount() {
    const {
      navigation: { setParams },
    } = this.props;
    setParams({
      submit: this.handleOnSubmitComment,
      comment: '',
    });
  }

  componentWillReceiveProps(nextProps) {
    const { result: prevResult } = this.props;
    const {
      result,
      navigation: { goBack, state },
    } = nextProps;
    if (result !== prevResult && result.success) {
      const { onSubmitComment } = state.params;
      goBack();
      onSubmitComment();
    }
  }

  handleOnChangeComment = (text) => {
    const { setParams } = this.props.navigation;
    this.setState({
      comment: text,
    });
    setParams({
      comment: text,
    });
  };

  handleOnSubmitComment = () => {
    const { addNovelComment, navigation } = this.props;
    const { novelId } = navigation.state.params;
    const { comment } = this.state;
    Keyboard.dismiss();
    addNovelComment(novelId, comment);
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
        style={[styles.container, { backgroundColor: theme.colors.surface }]}
      >
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
    )(AddNovelComment),
  ),
);

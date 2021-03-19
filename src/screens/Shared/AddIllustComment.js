import React, { Component } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { withTheme, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import { CommonActions } from '@react-navigation/native';
import { connectLocalization } from '../../components/Localization';
import PXTouchable from '../../components/PXTouchable';
import * as addIllustCommentActionCreators from '../../common/actions/addIllustComment';

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

class AddIllustComment extends Component {
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
      const { navigateFrom, illustId } = route.params;
      navigation.dispatch(
        CommonActions.navigate({
          name: navigateFrom.name,
          key: navigateFrom.key,
          params: {
            reload: true,
            fromId: illustId,
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
    const { addIllustComment, route } = this.props;
    const { illustId } = route.params;
    const { comment } = this.state;
    Keyboard.dismiss();
    addIllustComment(illustId, comment);
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
        result: state.addIllustComment,
      }),
      addIllustCommentActionCreators,
    )(AddIllustComment),
  ),
);

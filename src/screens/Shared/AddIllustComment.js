import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import { connectLocalization } from '../../components/Localization';
import PXTouchable from '../../components/PXTouchable';
import * as addIllustCommentActionCreators
  from '../../common/actions/addIllustComment';

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
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    const { submit, comment, illustId } = state.params;
    return {
      headerRight: submit &&
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
    const { result, navigation: { goBack } } = nextProps;
    if (result !== prevResult && result.success) {
      // todo goback and refresh
      goBack();
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
    const { illustId } = navigation.state.params;
    const { comment } = this.state;
    Keyboard.dismiss();
    addIllustComment(illustId, comment);
  };

  render() {
    const { i18n, result: { loading } } = this.props;
    const { comment } = this.state;
    return (
      <View style={styles.container}>
        <TextInput
          multiline
          autoFocus
          maxLength={140}
          placeholder={i18n.commentAdd}
          placeholderTextColor="#86939e"
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

export default connectLocalization(
  connect(
    state => ({
      result: state.addIllustComment,
    }),
    addIllustCommentActionCreators,
  )(AddIllustComment),
);

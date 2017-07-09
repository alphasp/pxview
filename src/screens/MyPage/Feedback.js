import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  DeviceEventEmitter,
  InteractionManager,
  Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import OverlaySpinner from 'react-native-loading-spinner-overlay';
import { connectLocalization } from '../../components/Localization';
import PXTouchable from '../../components/PXTouchable';
import * as errorActionCreators from '../../common/actions/error';
import firebase from '../../common/helpers/firebase';

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

class Feedback extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerRight:
        params &&
        params.submit &&
        <PXTouchable onPress={params.submit} disabled={!params.feedback}>
          <Icon
            name="pencil"
            style={{ padding: 10 }}
            size={20}
            color={params.feedback ? '#fff' : 'gray'}
          />
        </PXTouchable>,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      feedback: '',
      loading: false,
    };
  }

  componentDidMount() {
    const { navigation: { setParams } } = this.props;
    setParams({
      submit: this.handleOnSubmitFeedback,
      feedback: '',
    });
    this.ref = firebase.database().ref('feedback');
  }

  componentWillUnmount() {
    this.ref.off();
  }

  handleOnChangeText = text => {
    const { setParams } = this.props.navigation;
    this.setState({
      feedback: text,
    });
    setParams({
      feedback: text,
    });
  };

  handleOnSubmitFeedback = () => {
    const { i18n, addError, navigation: { goBack } } = this.props;
    const { feedback } = this.state;
    Keyboard.dismiss();
    this.setState({ loading: true });
    this.ref
      .push()
      .set({
        platform: DeviceInfo.getSystemName(),
        manufacturer: DeviceInfo.getManufacturer(),
        brand: DeviceInfo.getBrand(),
        model: DeviceInfo.getModel(),
        systemVersion: DeviceInfo.getSystemVersion(),
        appVersion: DeviceInfo.getVersion(),
        appBuildNumber: DeviceInfo.getBuildNumber(),
        locale: DeviceInfo.getDeviceLocale(),
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        feedback,
      })
      .then(() => {
        this.setState({ loading: false });
        goBack();
        InteractionManager.runAfterInteractions(() => {
          DeviceEventEmitter.emit('showToast', i18n.feedbackSuccess);
        });
      })
      .catch(() => {
        this.setState({ loading: false });
        addError(i18n.feedbackError);
      });
  };

  render() {
    const { i18n } = this.props;
    const { feedback, loading } = this.state;
    return (
      <View style={styles.container}>
        <TextInput
          multiline
          autoFocus
          placeholder={i18n.feedbackPlaceholder}
          placeholderTextColor="#86939e"
          underlineColorAndroid="transparent"
          style={styles.textInput}
          onChangeText={this.handleOnChangeText}
          value={feedback}
        />
        <OverlaySpinner visible={loading} />
      </View>
    );
  }
}

export default connectLocalization(
  connect(null, errorActionCreators)(Feedback),
);

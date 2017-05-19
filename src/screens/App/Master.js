import React, { Component } from 'react';
import { View, StyleSheet, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import Toast, { DURATION } from 'react-native-easy-toast';
import AppNavigator from '../../navigations/AppNavigator';
import { connectLocalization } from '../../components/Localization';
import Loader from '../../components/Loader';
import ModalRoot from '../../containers/ModalRoot';
import { resetError } from '../../common/actions/error';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheet: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  bottomSheetText: {
    marginLeft: 32,
  },
  bottomSheetListItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 48,
  },
  bottomSheetCancelIcon: {
    marginLeft: 3,
  },
  bottomSheetCancelText: {
    marginLeft: 36,
  },
});

class Master extends Component {
  componentDidMount() {
    MessageBarManager.registerMessageBar(this.messageBarAlert);
    this.listener = DeviceEventEmitter.addListener('showToast', text => {
      this.toast.show(text, DURATION.LENGTH_LONG);
    });
    // DeviceEventEmitter.emit('showToast', 'Maximum of tags is 10');
  }

  componentWillUnmount() {
    MessageBarManager.unregisterMessageBar();
    if (this.listener) {
      this.listener.remove();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { error } = nextProps;
    if (error) {
      MessageBarManager.hideAlert();
      MessageBarManager.showAlert({
        message: error,
        titleNumberOfLines: 0,
        alertType: 'error',
      });
    }
  }

  // gets the current screen from navigation state
  getCurrentRouteName = navigationState => {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return this.getCurrentRouteName(route);
    }
    return route.routeName;
  };

  handleOnNavigationStateChange = (prevState, currentState) => {
    const currentScreen = this.getCurrentRouteName(currentState);
    const prevScreen = this.getCurrentRouteName(prevState);
    if (prevScreen !== currentScreen) {
      const { dispatch } = this.props;
      dispatch(resetError());
    }
  };

  render() {
    const { rehydrated, i18n } = this.props;
    return (
      <View style={styles.container}>
        {rehydrated
          ? <AppNavigator
              onNavigationStateChange={this.handleOnNavigationStateChange}
              screenProps={{ i18n }}
            />
          : <Loader />}
        <MessageBar ref={ref => (this.messageBarAlert = ref)} />
        <Toast ref={ref => (this.toast = ref)} />
        <ModalRoot />
      </View>
    );
  }
}

export default connectLocalization(
  connect(state => ({
    error: state.error,
    rehydrated: state.auth.rehydrated,
  }))(Master),
);

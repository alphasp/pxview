import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  DeviceEventEmitter,
} from 'react-native';
import { connect } from 'react-redux'
import { addNavigationHelpers } from 'react-navigation';
import { DefaultRenderer } from 'react-native-router-flux';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import { Actions } from 'react-native-router-flux';
import Toast, { DURATION } from 'react-native-easy-toast';
import AppNavigator from '../navigations/AppNavigator';
import { resetError } from '../common/actions/error';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class Master extends Component {
  constructor(props){
    super(props);
    this.state = {
      page: 0
    };
  }

  componentDidMount() {
    MessageBarManager.registerMessageBar(this.messageBarAlert);
    this.listener = DeviceEventEmitter.addListener('showToast', (text) => {
      this.toast.show(text, DURATION.LENGTH_LONG);
    });
    //DeviceEventEmitter.emit('showToast', 'Maximum of tags is 10');
  }

  componentWillUnmount() {
    MessageBarManager.unregisterMessageBar();
    if (this.listener) {
      this.listener.remove();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { routes, dispatch } = this.props;
    const { routes: nextRoutes, error } = nextProps;
    const nextMessageBar = nextProps.messageBar
    const { messageBar } = this.props
    if (error){
      MessageBarManager.hideAlert();
      MessageBarManager.showAlert({
        message: error,
        titleNumberOfLines: 0,
        alertType: 'error',
      });
    }
    if (routes.scene.name != nextRoutes.scene.name){
      //maybe need to reset error on REACT_NATIVE_ROUTER_FLUX_FOCUS
      dispatch(resetError());
      // if (!isAuthLoaded(nextProps)) {
      //   dispatch(loadUserAuth())
      // }
    }
  }

  render() {
    // const { navigationState: { children } } = this.props;
    return (
      <View style={styles.container}>
        <AppNavigator />
        <MessageBar ref={ref => this.messageBarAlert = ref}/>
        <Toast ref={ref => this.toast = ref} />
      </View>
    );
    //        <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />

  }
}

export default connect(state => {
  return {
    error: state.error,
    routes: state.routes,
  }
})(Master);
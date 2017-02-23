import React from 'react';
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  View,
  WebView,
} from 'react-native';

const PXWebview = (props) => {
  console.log(props)
  return (
    <WebView {...props.navigation.state.params} />
  );
}

module.exports = PXWebview;

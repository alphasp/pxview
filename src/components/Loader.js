import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Spinner from 'react-native-spinkit';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const Loader = (props) => {
  return (
    <View style={styles.container}>
      <Spinner type="ThreeBounce" />
    </View> 
  );
}

export default Loader;

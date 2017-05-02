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
    justifyContent: 'center',
  },
});

const Loader = props => {
  const { verticalCenter } = props;
  const style = (verticalCenter === false) ? { flex: 0 } : {};
  return (
    <View style={[styles.container, style]}>
      <Spinner type="ThreeBounce" />
    </View>
  );
};

export default Loader;

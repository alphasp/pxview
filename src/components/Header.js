import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
} from 'react-native';

// const styles = StyleSheet.create({
//   container: {
//     //height: Platform.OS === 'ios' ? 64 : 54,
//     paddingTop: 0,
//     top: 0,
//     height: Platform.OS === 'ios' ? 64 : 54,
//     //height: Platform.OS === 'ios' || Platform.Version > 19 ? 64 : 44,
//     right: 0,
//     left: 0,
//     borderBottomWidth: 0.5,
//     borderBottomColor: '#828287',
//     position: 'absolute',
//     backgroundColor: '#1F3B5B',
//     borderBottomWidth: 0
//   }
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10
  },
});

const Loader = (props) => {
  return (
    <View style={styles.container}>
      { props.children }
    </View> 
  );
}

export default Loader;

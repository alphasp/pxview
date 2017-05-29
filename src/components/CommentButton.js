import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { connectLocalization } from './Localization';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  buttonContainer: {
    marginLeft: 0,
    marginRight: 0,
  },
});

const CommentButton = ({ i18n, onPress }) => (
  <View style={styles.container}>
    <Button
      raised
      icon={{ name: 'pencil', type: 'font-awesome' }}
      title={i18n.addComment}
      containerViewStyle={styles.buttonContainer}
      backgroundColor={globalStyleVariables.PRIMARY_COLOR}
      onPress={onPress}
    />
  </View>
);

export default connectLocalization(CommentButton);
